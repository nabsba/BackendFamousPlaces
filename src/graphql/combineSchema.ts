import typeDefsAuth from '../auth/graphQl/schema';
import typeDefsWeather from '../fakeApiMeteo/graphql/schema';
import { typeDefsPlaces } from '../famousPlace';
import { typeDefsJWT } from '../jwt';

export const typeDefs = [typeDefsPlaces, typeDefsAuth, typeDefsJWT, typeDefsWeather];
