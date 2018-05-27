import React from "react"
import {
  buildSchemaFromTypeDefinitions,
  addMockFunctionsToSchema,
} from "graphql-tools"
import { graphqlSync } from "graphql"
import schema from "../graphqlSchema"
const actualReactApollo = require.requireActual("react-apollo")

const mockServer = (schema, mocks) => {
  const mySchema = buildSchemaFromTypeDefinitions(schema)
  addMockFunctionsToSchema({ schema: mySchema, mocks })
  return { query: (query, vars) => graphqlSync(mySchema, query, {}, {}, vars) }
}

let server = mockServer(schema)
let explicitResponse = undefined

const setMockGraphQLResolvers = resolvers => {
  explicitResponse = undefined
  server = mockServer(schema, resolvers)
}

const setApolloLoading = () => {
  explicitResponse = { data: { loading: true } }
}

const setApolloError = error => {
  explicitResponse = {
    data: {
      loading: false,
      error: error || new Error("This is a mock apollo error"),
    },
  }
}

const graphql = (query, config) => {
  return Component => {
    return props => {
      let response =
        explicitResponse ||
        server.query(
          query.loc.source.body,
          config && config.options ? config.options(props).variables : {}
        )

      const rawResponse = { ...response }

      if (response.data && !explicitResponse) {
        response.data.loading = false
        response.data.fetchMore = ({ query, variables, updateQuery }) => {
          const fetchMoreResult = graphql(query, {
            options: props => ({
              variables,
            }),
          })(Component)(props).props.data

          updateQuery(rawResponse.data, { fetchMoreResult })
        }
      }

      if (config && config.props) {
        response = config.props({ ownProps: props, ...response })
      }

      return <Component {...response} {...props} />
    }
  }
}

const {
  compose,
  createBatchingNetworkInterface,
  ApolloClient,
  ApolloProvider,
} = actualReactApollo

export {
  graphql,
  compose,
  setApolloLoading,
  setApolloError,
  setMockGraphQLResolvers,
  createBatchingNetworkInterface,
  ApolloProvider,
  ApolloClient,
}
