import { gql } from 'apollo-server';

// GraphQL schema using gql template literal
const typeDefsPlaces = gql`
  type Place {
    id: String # ID field of type String (from TypeScript definition)
    popularity: Int # Popularity field of type Int
    price: Int # price field of type Int
    hoursTravel: String!
    address: Address # Address field related to Address type
    placeDetail: PlaceDetail # Place detail related to the Place
    images: [String!]!
    isFavoritePlace: Boolean!
  }

  type placeData {
    place: Place # Nullable array of nullable Place objects
    rowPerPage: Int!
    page: String!
    totalRows: Int!
  }

  type placesData {
    places: [Place] # Non-nullable array of non-nullable Place objects,
    rowPerPage: Int!
    page: String!
    totalRows: Int!
  }
  type placesResponse {
    status: Int! # Status code, e.g., 200 for success, 400 for failure
    isError: Boolean! # Indicates if an error occurred
    messageKey: String! # Message that provides additional information
    data: placesData
  }
  type placeResponse {
    status: Int! # Status code, e.g., 200 for success, 400 for failure
    isError: Boolean! # Indicates if an error occurred
    messageKey: String! # Message that provides additional information
    data: placeData
  }

  type preselectionNameData {
    selections: [Selection!]
  }

  type Selection {
    name: String!
    id: String!
  }

  type preselectionNameResponse {
    status: Int! # Status code, e.g., 200 for success, 400 for failure
    isError: Boolean! # Indicates if an error occurred
    messageKey: String! # Message that provides additional information
    data: preselectionNameData
  }

  type PlaceId {
    placeId: String!
  }
  type toggleFavoritePlace {
    status: Int! # Status code, e.g., 200 for success, 400 for failure
    isError: Boolean! # Indicates if an error occurred
    messageKey: String! # Message that provides additional information
    data: PlaceId
  }
  # GraphQL type definition for Address
  type Address {
    number: Int
    street: String
    postcode: String
    city: City
  }

  # GraphQL type definition for City
  type City {
    name: String
    country: Country
  }

  # GraphQL type definition for Country
  type Country {
    name: String
  }

  # GraphQL type definition for PlaceDetail
  type PlaceDetail {
    name: String
    description: String
    id: String
  }

  # Queries for fetching places
  type Query {
    place(placeId: String): placeResponse
    places(language: String, type: String, userId: String, page: String): placesResponse
    preselectionName(text: String, language: String, type: String, userId: String): preselectionNameResponse
  }

  input CreatePlace {
    name: String!
    description: String
  }

  # Mutations for manipulating Place
  type Mutation {
    createPlace(input: CreatePlace): Place
    deletePlace(id: Int): Place
    toggleFavoritePlace(placeId: String, userId: String): toggleFavoritePlace
  }
`;

export default typeDefsPlaces;
