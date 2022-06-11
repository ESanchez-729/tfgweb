type DetailedGame = {

  artworks : {id: number, url: string}[],
  category : number,
  cover : {id: number, url: string},
  dlcs : {id: number, name: string, cover: {id: number, url: string}}[],
  expansions : {id: number, name: string, cover: {id: number, url: string}}[],
  first_release_date : number,
  genres : {id: number, name: string}[],
  id: number,
  involved_companies : {id: number, company: {id: number, name: string}}[],
  name: string,
  platforms : {abbreviation: string, id: number, name: string}[],
  screenshots : {id: number, url: string}[],
  similar_games : {cover: {id: number, url: string}, id: number, name: string}[],
  summary : string,
  total_rating : number,
  websites : {category: number, id: number, url: string}[]
  
}

export default DetailedGame;