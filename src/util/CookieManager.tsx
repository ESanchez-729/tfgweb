class CookieManager {

    static setCookie(cname: string, cvalue: string, exhours: number)  {
        const d = new Date();
        d.setTime(d.getTime() + (exhours*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    static getCookie(cname: string): string {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    static checkCookie(cname: string): boolean {
        let cookie = CookieManager.getCookie(cname);
        if (cookie !== "" && cookie !== "undefined") {
          return true
        } else {
          return false
        }
    }

    static removeCookie(cname: string) {
      CookieManager.setCookie(cname, "", 0)
    }

}

export default CookieManager