import prismaClientDB from '../../lib/prismadb';

async function main() {
  try {
    // Ensure countries are created only once and avoid duplication
    const countries = await prismaClientDB.country.findMany({
      where: { name: { in: ['France', 'Italy', 'Japan', 'USA', 'England', 'Chile'] } },
    });

    const existingCountries = new Set(countries.map((country) => country.name));

    // Array of country names for easy lookups
    const countriesToCreate = ['France', 'Italy', 'Japan', 'USA', 'England', 'Chile'];

    // Create any missing countries
    const createCountries = countriesToCreate
      .filter((country) => !existingCountries.has(country))
      .map((country) => {
        return prismaClientDB.country.create({
          data: { name: country },
        });
      });

    // Wrap the transaction to create countries and places
    await prismaClientDB.$transaction([
      ...createCountries,
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
          image: 'hotel_de_paris_monte-carlo',
          price: '50',
          hoursTravel: '8',
          address: {
            create: {
              number: 1,
              street: 'Place du Casino',
              postcode: '98000',
              city: {
                create: {
                  name: 'Monaco',
                  country: {
                    connect: { name: 'France' }, // Corrected to France
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
          price: '30',
          hoursTravel: '4',
          address: {
            create: {
              number: 1,
              street: 'Piazza del Colosseo',
              postcode: '00184',
              city: {
                create: {
                  name: 'Rome',
                  country: {
                    connect: { name: 'Italy' }, // Corrected to Italy
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
      prismaClientDB.place.create({
        data: {
          popularity: 9,
          image: 'leaning_tower_of_pisa',
          price: '50',
          hoursTravel: '8',
          address: {
            create: {
              number: 1,
              street: 'Piazza del Duomo',
              postcode: '56126',
              city: {
                create: {
                  name: 'Pisa',
                  country: {
                    connect: { name: 'Italy' }, // Corrected to Italy
                  },
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
      prismaClientDB.place.create({
        data: {
          popularity: 10,
          image: 'buckingham_palace',
          price: '0',
          hoursTravel: '0.5',
          address: {
            create: {
              number: 1,
              street: 'Buckingham Palace Road',
              postcode: 'SW1A 1AA',
              city: {
                create: {
                  name: 'London',
                  country: {
                    connect: { name: 'England' }, // Corrected to England
                  },
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Buckingham Palace',
                description: `Buckingham Palace is the London residence and administrative headquarters of the monarch of the United Kingdom.`,
                languageId: 1,
              },
              {
                name: 'Palais de Buckingham',
                description: `Le Palais de Buckingham est la résidence officielle et le siège administratif du monarque du Royaume-Uni.`,
                languageId: 2,
              },
            ],
          },
        },
      }),
      prismaClientDB.place.create({
        data: {
          popularity: 9,
          image: 'tower_bridge',
          price: '0',
          hoursTravel: '0.5',
          address: {
            create: {
              number: 1,
              street: 'Tower Bridge Road',
              postcode: 'SE1 2UP',
              city: {
                create: {
                  name: 'London',
                  country: {
                    connect: { name: 'England' }, // Corrected to England
                  },
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Tower Bridge',
                description: `Tower Bridge is one of London's most famous landmarks, known for its iconic twin towers and suspension design.`,
                languageId: 1,
              },
              {
                name: 'Pont de la Tour',
                description: `Le Tower Bridge est l'un des monuments les plus célèbres de Londres, connu pour ses tours jumelles iconiques.`,
                languageId: 2,
              },
            ],
          },
        },
      }),
      prismaClientDB.place.create({
        data: {
          popularity: 8,
          image: 'stonehenge',
          price: '20',
          hoursTravel: '2',
          address: {
            create: {
              number: 1,
              street: 'Amesbury',
              postcode: 'SP4 7DE',
              city: {
                create: {
                  name: 'Amesbury',
                  country: {
                    connect: { name: 'England' }, // Corrected to England
                  },
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Stonehenge',
                description: `Stonehenge is a prehistoric monument in Wiltshire, England, consisting of a ring of standing stones.`,
                languageId: 1,
              },
              {
                name: 'Stonehenge',
                description: `Stonehenge est un monument préhistorique situé dans le Wiltshire, en Angleterre, composé d'un anneau de pierres dressées.`,
                languageId: 2,
              },
            ],
          },
        },
      }),
      prismaClientDB.place.create({
        data: {
          popularity: 7,
          image: 'andes_mountains',
          price: '30',
          hoursTravel: '10',
          address: {
            create: {
              number: 1,
              street: 'Andes Mountains Road',
              postcode: '8320000',
              city: {
                create: {
                  name: 'Santiago',
                  country: {
                    connect: { name: 'Chile' }, // Added Chile
                  },
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Andes Mountains',
                description: `The Andes Mountains stretch along the western edge of South America, offering stunning views and challenging hikes.`,
                languageId: 1,
              },
              {
                name: 'Les montagnes des Andes',
                description: `Les montagnes des Andes s'étendent le long du bord occidental de l'Amérique du Sud, offrant des vues magnifiques et des randonnées difficiles.`,
                languageId: 2,
              },
            ],
          },
        },
      }),
      prismaClientDB.place.create({
        data: {
          popularity: 9,
          image: 'mount_fuji',
          price: '40',
          hoursTravel: '7',
          address: {
            create: {
              number: 1,
              street: 'Fuji Road',
              postcode: '400-0031',
              city: {
                create: {
                  name: 'Fujiyoshida',
                  country: {
                    connect: { name: 'Japan' }, // Added Japan
                  },
                },
              },
            },
          },
          placeDetail: {
            create: [
              {
                name: 'Mount Fuji',
                description: `Mount Fuji is Japan's tallest peak and an iconic symbol, attracting climbers and tourists from around the world.`,
                languageId: 1,
              },
              {
                name: 'Mont Fuji',
                description: `Le Mont Fuji est le plus haut sommet du Japon et un symbole emblématique, attirant des grimpeurs et des touristes du monde entier.`,
                languageId: 2,
              },
            ],
          },
        },
      }),
      // Continue adding other places here...
    ]);

    console.log('All records created successfully');
  } catch (error) {
    console.error('Error during transaction:', error);
  } finally {
    await prismaClientDB.$disconnect();
  }
}

main();
