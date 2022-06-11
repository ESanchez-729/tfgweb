import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { action, computed, makeObservable, observable, runInAction } from "mobx"
import ProfileSB from "../models/ProfileSB"
import CookieManager from "../util/CookieManager"

const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkd3NrdG9ocmh1bHVrcHptaWtlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDk2MDc3MzEsImV4cCI6MTk2NTE4MzczMX0.FK8vTPRkX_ddUd-lijECBpWmLGuFoj7pe89TzvH9Zpk"

class ProfileViewmodel {

    @observable loggedUser : ProfileSB = {}
    @observable lastSeenUser : ProfileSB = {}
    @observable loggedIn : boolean = false
    static db : SupabaseClient
    static viewModel : ProfileViewmodel
    static CMngr : CookieManager = new CookieManager()

    constructor() {
        makeObservable(this)
    }

    static getInstance() {
        
        if(ProfileViewmodel.viewModel === undefined) {
            ProfileViewmodel.viewModel = new ProfileViewmodel()
            ProfileViewmodel.db = createClient('https://hdwsktohrhulukpzmike.supabase.co', key, {
                persistSession: false,
                autoRefreshToken: true
            })
            ProfileViewmodel.viewModel.checkLoggedIn()
            ProfileViewmodel.viewModel.requestLoggedUser()
        } 

        return ProfileViewmodel.viewModel

    }

    @action checkLoggedIn = () => {
        this.loggedIn = (CookieManager.checkCookie("SBAccessToken") && CookieManager.checkCookie("SBRefreshToken"))
    }

    @action requestLoggedUser = async () => {

        let accessCookie = CookieManager.getCookie("SBAccessToken")
        if (accessCookie === undefined || accessCookie === null) {
            this.loggedUser = {}
            this.loggedIn = false
        } else {

            let {user, error} = await ProfileViewmodel.db.auth.api.getUser(accessCookie)

            if (user !== undefined) {
                let profile = (await ProfileViewmodel.db.from<ProfileSB>("profile").select().eq("user_id", user?.id).single()).body
                runInAction(() => {
                    if(profile !== null) {
                        this.loggedUser = profile!
                        this.loggedIn = true
                    } else {
                        this.loggedUser = {}
                        this.loggedIn = false
                    }
                })
    
            } else {
    
                runInAction(() => {
                    console.log(error)
                    this.loggedUser = {}
                    this.loggedIn = false
                })
            }

        }

    }

    @action requestUser = async (uid : string) => {

        let profile = (await ProfileViewmodel.db.from<ProfileSB>("Profile").select().eq("user_id", uid).single()).body
        runInAction(() => {
            if(profile !== null) {
                this.lastSeenUser = profile!
            } else {
                this.lastSeenUser = {}
            }
        })

    }

    @action deleteLoggedUser = () => {
        ProfileViewmodel.db.auth.signOut()
        CookieManager.removeCookie("SBAccessToken")
        CookieManager.removeCookie("SBRefreshToken")
        this.loggedUser = {}
        this.loggedIn = false
    }

    @computed get isLoggedIn() {
        return this.loggedIn
    }

    @computed get getCurrentProfilePic() {
        return this.loggedUser.avatar_url
    }

    @computed get getCurrentUserName() {
        return this.loggedUser.username
    }

    @computed get getCurrentUserId() {
        return this.loggedUser.user_id
    }

    @computed get getLastSeenUser() {
        return this.lastSeenUser
    }

    @computed get getDB() {
        return ProfileViewmodel.db
    }

}

export default ProfileViewmodel