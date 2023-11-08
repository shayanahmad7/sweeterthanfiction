# Sweeter Than Fiction

## Overview

Sweeter Than Fiction is a community web app designed exclusively for Taylor Swift enthusiasts. It serves as a hub for fans to explore Taylor Swift's extensive discography, engage in discussions, and document their Swiftie journey. Here are the key features:

- Users can create an account and log in.
- Access a comprehensive database of Taylor Swift's songs and albums.
- Search for songs directly or explore albums to view their tracklists.
- View detailed information about each song, including lyrics and descriptions.
- Engage in discussions about songs, albums, and Taylor Swift in general.
- Create and edit wishlists, allowing users to document their current favorite songs and share their thoughts with the community.

## Data Model

Sweeter Than Fiction will utilize the following data model:

- **Users**
  - Name
  - Email
  - Username
  - Birthday
  - Password (hashed)

- **Albums**
  - Title
  - Release Date
  - Awards
  - List of Songs

- **Songs**
  - Title
  - Lyrics
  - Description
  - Album
  - Discussion Comments

- **Discussion Posts**
  - User
  - Content
  - Timestamp

- **Wishlist**
  - User
  - Song
  - Description
  - Timestamp (for each edit)

## User Authentication

Sweeter Than Fiction will implement a straightforward user authentication process. When registering, users will be prompted to provide the following information:

- Name
- Email
- Username
- Birthday
- Password (hashed)

To log in, users will need to enter either their email or username along with their password.

Passwords will be securely hashed before being stored in the database to ensure user security.

## Wireframes

### /home - Homepage

![home](documentation/home.png)

### /album - Album Details

![album details](documentation/album-details.png)

### /song - Song Details

![song details](documentation/song-details.png)

### /discussion - Discussion Page

![discussion page](documentation/discussion-page.png)

### /wishlist - Wishlist Page

![wishlist](documentation/wishlist.png)

### /profile - User Profile

![user profile](documentation/user-profile.png)

## Site Map

- Home Page
  - Login
  - Register

- User Dashboard
  - Profile
    - Name
    - Email
    - Username
    - Birthday
  - Albums
    - List of Albums
      - Album Details
        - Song List
          - Song Details
            - Lyrics
            - Description
        - Discussion Section
  - Wishlists
    - List of Wishlists
      - Wishlist Details
        - Wishlist Items
          - Wishlist Item Details
            - Description
            - Timestamp (for each edit)
        - Discussion Section

- Discussions
  - General Discussion
    - Posts
      - Post Details
        - Comments
  - Album Discussions
    - List of Albums
      - Album Discussion
        - Posts
          - Post Details
            - Comments
  - Song Discussions
    - List of Songs
      - Song Discussion
        - Posts
          - Post Details
            - Comments


## User Stories or Use Cases

1. As a Taylor Swift fan, I want to be able to create an account on the website so that I can engage with the community and access the features.
2. As a registered user, I want to log in to the site with my email or username and password.
3. As a user, I want to explore Taylor Swift's albums and view the tracklists.
4. As a user, I want to view detailed information about each song, including lyrics and descriptions.
5. As a user, I want to participate in discussions about songs, albums, and Taylor Swift in general.
6. As a user, I want to create and edit wishlists to document my current favorite songs and share my thoughts with the community.

## Research Topics

- (5 points) Integrate user authentication
    - Utilize basic user information (Name, Email, Username, Birthday, Password) for registration and login.

- (4 points) Implement client-side form validation using JavaScript library.

- (5 points) Utilize vue.js as the frontend framework for a dynamic user experience.

Total Points: 14 (Exceeding the required 8 points)

## Link to Initial Main Project File

[Link to Initial Main Project File](app.mjs)

## Annotations / References Used

1. [passport.js authentication docs](http://passportjs.org/docs) - (add link to source code that was based on this)
2. [tutorial on vue.js](https://vuejs.org/v2/guide/) - (add link to source code that was based on this)
