# URL Shortener

URL Shortener is a web application that converts long URLs into shorter, more manageable links. It provides a convenient way to share links, especially on platforms with character limitations or to make lengthy URLs more user-friendly.

[*UrlShortner*](https://animated-cuchufli-a2e8a1.netlify.app/)


[![Screenshot-2023-07-16-014647.png](https://i.postimg.cc/JhYLg7Kh/Screenshot-2023-07-16-014647.png)](https://postimg.cc/LqPwgpcd)

## Description

This project aims to build a URL shortener service with the following features:

- Shorten long URLs: Users can input a long URL and receive a shortened version that redirects to the original URL.
- Customized URLs: Optionally, users can create custom aliases for their shortened URLs to make them more memorable and meaningful.
- Analytics: The system tracks the number of clicks and provides basic analytics on the usage of shortened URLs.
- User Registration and Management: Users can create accounts, log in, and manage their shortened URLs. This allows for easy tracking and organization of links.
## Project DeployMent Link

[*Click Here*](https://animated-cuchufli-a2e8a1.netlify.app/)


## Front End Source Code

[FrontEnd Source Code](https://github.com/Ketan835985/Url-Shortner-FrontEnd.git)

## Project Requirements

### Phase I

#### Overview

URL shortening is used to create shorter aliases for long URLs. These shortened aliases, known as "short links," redirect users to the original URL when accessed. Short links save space when displayed, printed, messaged, or tweeted, and they reduce the likelihood of mistyping longer URLs.

For example, if we shorten the following URL through TinyURL:

Original URL: https://babeljs.io/blog/2020/10/15/7.12.0#class-static-blocks-12079httpsgithubcombabelbabelpull12079-12143httpsgithubcombabelbabelpull12143

Shortened URL: https://tinyurl.com/y4ned4ep

The shortened URL is nearly one-fifth the size of the original URL.

Some use cases for URL shortening include optimizing links shared across users, easily tracking individual links, and sometimes hiding the affiliated original URLs.

#### Key Points

- Create a group database `groupXDatabase`. You can clean the previously used database and reuse it.
- Each group should have a single git branch. Coordinate among team members to ensure that every next person pulls the code last pushed by a teammate. The branch name should follow the naming convention `project/urlShortenerGroupX`.
- Follow the naming conventions exactly as instructed. The backend code will be integrated with the frontend application, meaning any mismatch in the expected request body will result in a failure of successful integration.

#### Models

**Url Model**

```json
{
  "urlCode": { "mandatory", "unique", "lowercase", "trim" },
  "longUrl": { "mandatory", "valid url" },
  "shortUrl": { "mandatory", "unique" }
}
```

#### API Endpoints

1. **POST /url/shorten**

   - Create a short URL for the original URL received in the request body.
   - The `baseUrl` must be the application's base URL. For example, if the original URL is `http://abc.com/user/images/name/2`, the shortened URL should be `http://localhost:3000/xyz`.
   - Return the shortened unique URL. Refer to the response structure provided for the expected response.
   - Ensure the same response is returned for the same original URL every time.
   - Return HTTP status 400 for an invalid request.

2. **GET /:urlCode**

   - Redirect to the original URL corresponding to the `urlCode`.
   - Use a valid HTTP status code meant for a redirection scenario.
   - Return a suitable error for a URL not found.
   - Return HTTP status 400 for an invalid request.

#### Testing

To test these APIs, create a new collection in Postman named "Project 2 URL Shortener." Each API should have a new request in this collection, and each request should be named appropriately. Each team member should have their tests in a running state.

###

 Phase II

- Consider that when a famous person with a wide following posts a link on Twitter, the link gets frequented by millions within a day.
- Implement caching in our application so that a newly created link is cached for 24 hours. When a person uses a short URL, the long URL should be retrieved from the cache during the first 24 hours after the URL's creation.
- Use caching while fetching the shortened URL to minimize database calls.
- Implement logic that makes sense to you, and we will build understanding over the assessment of this project. You should understand and be able to explain the logic you have implemented.

## Response

### Successful Response Structure

```json
{
  "status": true,
  "data": {

  }
}
```

### Error Response Structure

```json
{
  "status": false,
  "message": ""
}
```

### Response Samples

**URL Shorten Response**

```json
{
  "status": true,
  "data": {
    "longUrl": "http://www.abc.com/oneofthelongesturlseverseenbyhumans.com",
    "shortUrl": "http://localhost:3000/ghfgfg",
    "urlCode": "ghfgfg"
  } 
}
```

Please note that this README document provides an overview of the URL Shortener project requirements and outlines the necessary endpoints and models. Additional implementation details, such as technologies used, installation instructions, and deployment steps, should be added as needed.

