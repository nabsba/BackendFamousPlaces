import { gql } from 'apollo-server';

const typeDefsWeather = gql`
  type weatherResponse {
    status: Int! # Status code, e.g., 200 for success, 400 for failure
    isError: Boolean! # Indicates if an error occurred
    messageKey: String! # Message that provides additional information
    data: weather
  }

  type weather {
    city: String
    temperature: Float
    description: String
    humidity: Int
    windSpeed: Float
    sunrise: String
  }

  type Query {
    weather(city: String!): weatherResponse
  }
`;

export default typeDefsWeather;
