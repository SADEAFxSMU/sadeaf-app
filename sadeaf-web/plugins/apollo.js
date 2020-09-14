import {Auth} from "aws-amplify";

// export default (context) => {
//   return {
//     httpEndpoint: '/api/graphql',
//     wsEndpoint: 'ws://localhost:3000/api/graphql',
//     preAuthLinks: [],
//     getAuth: async () => {
//       const session = await Auth.currentSession()
//       const jwtToken = session?.getIdToken()?.getJwtToken()
//
//       if (jwtToken)
//         return `Bearer ${jwtToken}`
//     },
//   }
// }

// TODO(fuxing): Setup Apollo Link Client


export default function (context, inject) {

}
