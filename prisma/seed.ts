import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const booksData = [
  {
    title: "Why the Nations Fail",
    description:
      "A groundbreaking theory on the origins of power, prosperity, and poverty. It answers the centuries-old question of why some nations are rich and others poor, divided by wealth and poverty, health and sickness, food and famine.",
    author: "Daron Acemoglu and James A. Robinson",
    price: 14.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/9/9f/Why_Nations_Fail_Cover.jpg",
    fileUrl: "https://pdfdrive.com.co/wp-content/pdfh/Why-Nations-Fail_.pdf",
    genres: ["Financial", "Comparative politics", "Economics"],
  },
  {
    title: "Steal Like an Artist",
    description:
      "An inspiring guide to creativity in the digital age. It presents ten transformative principles to help readers discover their artistic side and build a more creative life, arguing that nothing is original and we should embrace influence.",
    author: "Austin Kleon",
    price: 9.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/e/eb/Steal_Like_an_Artist.jpg",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/Steal-LikeanArtist-PDFdrive.pdf",
    genres: ["Self-help book"],
  },
  {
    title: "Man's Search for Meaning",
    description:
      "A 1946 book by Viktor Frankl chronicling his experiences as a prisoner in Nazi concentration camps during World War II, and describing his psychotherapeutic method—logotherapy—of finding meaning in all forms of existence.",
    author: "Viktor Frankl",
    price: 12.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/c/cf/Trotzdem_Ja_zum_Leben_sagen_%28Viktor_Frankl_novel%29_cover.jpg",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/man%27s-search-for-meaning.pdf",
    genres: ["Biography", "Autobiography", "Personal narrative"],
  },
  {
    title: "Buy Then Build",
    description:
      "Walker Deibel's guide on how acquisition entrepreneurs can bypass the startup phase and generate profitable revenue on day one by buying an existing, sustainable company and growing it from there.",
    author: "Walker Deibel",
    price: 19.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/7/78/Buy_Then_Build.jpg",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/Buy-Then-Build-PDFdrive.pdf",
    genres: ["Business & Career"],
  },
  {
    title: "What to Expect When You're Expecting",
    description:
      "A comprehensive pregnancy guide that follows a question-and-answer format, chronologically detailing the stages of pregnancy from conception through the postpartum period, addressing common symptoms and concerns.",
    author: "Heidi Murkoff and Sharon Mazel",
    price: 11.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/bb/What_to_Expect_When_You%27re_Expecting_2025_Cover.webp/304px-What_to_Expect_When_You%27re_Expecting_2025_Cover.webp.png",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/What%20to%20Expect%20When%20You're%20Expecting%20PDF%20.pdf",
    genres: ["Family + Relationships"],
  },
  {
    title: "To Kill a Mockingbird",
    description:
      "A novel by Harper Lee set in the American South, addressing serious issues of racial injustice and moral growth. The story is told through the eyes of a young girl, Scout Finch, whose father Atticus defends a Black man falsely accused of a crime.",
    author: "Harper Lee",
    price: 8.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg/500px-To_Kill_a_Mockingbird_%28first_edition_cover%29.jpg",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/To-Kill-A-Mockingbird-PDFdrive.com.co.pdf",
    genres: ["Novel", "Southern Gothic", "Bildungsroman"],
  },
  {
    title: "The Great Gatsby",
    description:
      "A 1925 novel by F. Scott Fitzgerald set in the Jazz Age on Long Island. It depicts the mysterious millionaire Jay Gatsby and his obsessive pursuit of Daisy Buchanan, exploring themes of wealth, love, and the American Dream.",
    author: "F. Scott Fitzgerald",
    price: 7.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/The_Great_Gatsby_Cover_1925_Retouched.jpg/500px-The_Great_Gatsby_Cover_1925_Retouched.jpg",
    fileUrl: "https://pdfdrive.com.co/wp-content/pdfh/The-Great-Gatsby.pdf",
    genres: ["Tragedy"],
  },
  {
    title: "Pride and Prejudice",
    description:
      "A classic novel by Jane Austen that follows the tumultuous relationship between Elizabeth Bennet, the daughter of a country gentleman, and Fitzwilliam Darcy, a rich aristocratic landowner, exploring themes of love, class, and social reputation.",
    author: "Jane Austen",
    price: 7.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/PrideAndPrejudiceTitlePage.jpg/500px-PrideAndPrejudiceTitlePage.jpg",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/Pride-and-Prejudice-Book.pdf",
    genres: [
      "Romance novel",
      "Fiction",
      "Satire",
      "Regency romance",
      "Novel of manners",
    ],
  },
  {
    title: "A Game of Thrones",
    description:
      "The first novel in 'A Song of Ice and Fire,' a series of high fantasy novels by George R. R. Martin. It chronicles the violent dynastic struggles among the noble families of Westeros for control of the Iron Throne.",
    author: "George R. R. Martin",
    price: 13.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/9/93/AGameOfThrones.jpg",
    fileUrl: "https://pdfdrive.com.co/wp-content/pdfh/A-Game-of-Thrones.pdf",
    genres: ["Novel", "Fantasy Fiction", "High fantasy", "Political fiction"],
  },
  {
    title: "The Silent Patient",
    description:
      "A psychological thriller about a psychotherapist, Theo Faber, who is obsessed with treating Alicia Berenson, a famous painter who shot her husband and has not spoken a single word since.",
    author: "Alex Michaelides",
    price: 10.99,
    coverImage:
      "https://en.wikipedia.org/wiki/File:The_Silent_Patient_early_2019_UK_edition.png",
    fileUrl: "https://pdfdrive.com.co/wp-content/pdfh/The-Silent-Patient.pdf",
    genres: [
      "Thriller",
      "Novel",
      "Mystery",
      "Psychological thriller",
      "Suspense",
      "Psychological Fiction",
      "Crime Fiction",
    ],
  },
  {
    title: "All the Light We Cannot See",
    description:
      "A Pulitzer Prize-winning novel about a blind French girl and a German boy whose paths collide in occupied France as both try to survive the devastation of World War II, their stories interwoven by a radio.",
    author: "Anthony Doerr",
    price: 11.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/2/22/All_the_Light_We_Cannot_See_%28Doerr_novel%29.jpg",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/the%20Light%20We%20Cannot%20See.pdf",
    genres: ["Novels", "Historical Fiction", "War story"],
  },
  {
    title: "Red, White & Royal Blue",
    description:
      "A 2019 LGBT romance novel focusing on the character of Alex Claremont-Diaz, the First Son of the United States, and his romantic relationship with Prince Henry, a British prince.",
    author: "Casey McQuiston",
    price: 9.99,
    coverImage:
      "https://upload.wikimedia.org/wikipedia/en/8/80/Red%2C_White_%26_Royal_Blue_Book_Cover.jpg",
    fileUrl:
      "https://pdfdrive.com.co/wp-content/pdfh/Red-White-And-Royal-Blue.pdf",
    genres: ["Novels", "Romantic Novels"],
  },
];

async function main() {
  console.log("Seeding started...");

  console.log("Clearing existing data...");
  await prisma.ebookGenre.deleteMany({});
  await prisma.ebook.deleteMany({});
  await prisma.genre.deleteMany({});

  console.log("Creating genres...");
  const allGenreNames = new Set<string>();
  booksData.forEach((book) => {
    book.genres.forEach((genre) => {
      allGenreNames.add(genre.trim());
    });
  });

  const uniqueGenres = Array.from(allGenreNames);
  await prisma.genre.createMany({
    data: uniqueGenres.map((name) => ({ name })),
  });

  const allGenresFromDb = await prisma.genre.findMany();
  const genreMap = new Map<string, string>();
  allGenresFromDb.forEach((genre) => {
    genreMap.set(genre.name, genre.id);
  });

  console.log("Creating ebooks and linking genres...");
  for (const book of booksData) {
    const newEbook = await prisma.ebook.create({
      data: {
        title: book.title,
        description: book.description,
        author: book.author,
        price: book.price,
        coverImage: book.coverImage,
        fileUrl: book.fileUrl,
      },
    });

    const genreIdsForBook = book.genres
      .map((name) => genreMap.get(name.trim()))
      .filter((id) => id !== undefined) as string[];

    if (genreIdsForBook.length > 0) {
      await prisma.ebookGenre.createMany({
        data: genreIdsForBook.map((genreId) => ({
          ebookId: newEbook.id,
          genreId: genreId,
        })),
      });
    }
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
