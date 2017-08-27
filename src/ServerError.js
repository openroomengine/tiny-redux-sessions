export default class ServerError extends Error {
  constructor (res) {
    super(`${res.status}: ${res.statusText}`)

    this.name = 'ServerError'
    this.response = res
  }
}
