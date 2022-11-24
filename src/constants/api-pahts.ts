// const URL = '' //running in the cloud, with docker
// const URL = 'http://localhost:8000' //running locally
const URL = '44.196.68.72:3000' //running production
const API_VERSION = 'v1'

export const API_PATHS = {
  companies: `${URL}/${API_VERSION}/companies`,
  users: `${URL}/${API_VERSION}/users`,
  userSession: `${URL}/${API_VERSION}/user-session`
}