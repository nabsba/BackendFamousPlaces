import { resolversAuth } from '../auth/graphQl/resolver';
import { resolverWeather } from '../fakeApiMeteo/graphql/resolver';
import { resolversPlace } from '../famousPlace';
import { resolversJWT } from '../jwt';

const resolvers = {
  Query: {
    ...resolversPlace.Query,
    ...resolversAuth.Query,
    ...resolverWeather.Query,
  },
  Mutation: {
    ...resolversPlace.Mutation,
    ...resolversAuth.Mutation,
    ...resolversJWT.Mutation,
  },
};

export { resolvers };
