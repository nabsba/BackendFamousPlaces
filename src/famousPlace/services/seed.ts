import prismaClientDB from '../../lib/prismadb';

async function main() {
  try {
    await prismaClientDB.$transaction([
      // France
      prismaClientDB.role.create({
        data: {
          roleName: 'client',
        },
      }),
      prismaClientDB.language.createMany({
        data: [{ type: 'eng' }, { type: 'fr' }],
        skipDuplicates: true,
      }),
      prismaClientDB.place.create({
        data: {
          popularity: 10,
          image: 'hotel_de_paris_monte-Carlo',
          address: {
            create: {
              number: 1,
              street: 'Place du Casino',
              postcode: '98000',
              city: {
                create: {
                  name: 'Monaco',
                  country: {
                    create: {
                      name: 'France',
                    },
                  },
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Hôtel de Paris Monte-Carlo',
                description: `Le majestueux Hôtel de Paris Monte-Carlo se dresse sur la place du Casino...`,
                languageId: 2,
              },
              {
                name: 'Hotel de Paris Monte-Carlo',
                description: `The majestic Hôtel de Paris Monte-Carlo is set like a breathtaking tableau...`,
                languageId: 1,
              },
            ],
          },
        },
      }),
      prismaClientDB.place.create({
        data: {
          popularity: 10,
          image: 'colosseum',
          address: {
            create: {
              number: 1,
              street: 'Piazza del Colosseo',
              postcode: '00184',
              city: {
                create: {
                  name: 'Rome',
                  country: {
                    create: {
                      name: 'Italy',
                    },
                  },
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Colosseum',
                description: `Le Colisée est un amphithéâtre romain antique situé au centre de Rome...`,
                languageId: 2,
              },
              {
                name: 'Colosseum',
                description: `The Colosseum is an ancient Roman amphitheatre located in the center of Rome...`,
                languageId: 1,
              },
            ],
          },
        },
      }),
      // Continue wrapping all the other place creation calls in the transaction...
      prismaClientDB.place.create({
        data: {
          popularity: 9,
          image: 'piazza_del_duomo',
          address: {
            create: {
              number: 1,
              street: 'Piazza del Duomo',
              postcode: '56126',
              city: {
                create: {
                  name: 'Pisa',
                  countryId: 2,
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Tour penchée de Pise',
                description: `La Tour penchée de Pise, communément appelée la Tour de Pise...`,
                languageId: 2,
              },
              {
                name: 'Leaning Tower of Pisa',
                description: `The Leaning Tower of Pisa is one of Italy's most iconic landmarks...`,
                languageId: 1,
              },
            ],
          },
        },
      }),
      // Repeat this pattern for the rest of the places you are inserting
    ]);

    // After all the operations are committed, log success
    console.log('All records created successfully');
  } catch (error) {
    // If anything fails, log the error
    console.error('Error during transaction:', error);
  } finally {
    await prismaClientDB.$disconnect();
  }
}
main();
