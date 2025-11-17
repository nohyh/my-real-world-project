export const mockArticle = {
  title: 'How to build webapps that scale',
  author: {
    username: 'Eric Simons',
    image: 'http://i.imgur.com/Qr71crq.jpg',
  },
  date: 'January 20th',
  following: false,
  favoritesCount: 29,
  favorited: false,
  body: "<p>Web development technologies have evolved at an incredible clip over the past few years.</p><h2 id=\"introducing-ionic\">Introducing RealWorld.</h2><p>It's a great solution for learning how other frameworks work.</p>",
  tagList: ['realworld', 'implementations'],
};

export const mockComments = [
  {
    id: 1,
    body: 'With supporting text below as a natural lead-in to additional content.',
    author: {
      username: 'Jacob Schmidt',
      image: 'http://i.imgur.com/Qr71crq.jpg',
    },
    date: 'Dec 29th',
  },
  {
    id: 2,
    body: 'With supporting text below as a natural lead-in to additional content.',
    author: {
      username: 'Jacob Schmidt',
      image: 'http://i.imgur.com/Qr71crq.jpg',
    },
    date: 'Dec 29th',
  },
];

export const mockProfile = {
  username: 'test',
  bio: 'This is a test user',
  image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
  following: false,
};

export const mockArticles = [
    {
        "slug": "how-to-buil-webapps-that-scale",
        "title": "How to build webapps that scale",
        "description": "This is the description for the post.",
        "body": "This is the body of the article.",
        "tagList": ["realworld", "implementations"],
        "createdAt": "2023-01-20T12:00:00.000Z",
        "updatedAt": "2023-01-20T12:00:00.000Z",
        "favorited": false,
        "favoritesCount": 29,
        "author": {
            "username": "Eric Simons",
            "bio": null,
            "image": "http://i.imgur.com/Qr71crq.jpg",
            "following": false
        }
    },
    {
        "slug": "the-song-you",
        "title": "The song you won't ever stop singing. No matter how hard you try.",
        "description": "This is the description for the post.",
        "body": "This is the body of the article.",
        "tagList": ["Music", "Song"],
        "createdAt": "2023-01-20T12:00:00.000Z",
        "updatedAt": "2023-01-20T12:00:00.000Z",
        "favorited": false,
        "favoritesCount": 32,
        "author": {
            "username": "Albert Pai",
            "bio": null,
            "image": "http://i.imgur.com/N4VcUeJ.jpg",
            "following": false
        }
    }
];
