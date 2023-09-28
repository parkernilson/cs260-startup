# Storyteller Soundboard
Dungeons and Dragons is rapidly becoming the most popular tabletop role-playing game in America. With incredibly high production DnD podcasts and tv shows becoming more and more common, peoples' standards are becoming higher. Sound effects and awesome music elevate the experience ten-fold. You and all your friends need a way to have a shared soundboard you can pull up on your phone to use during all of your DnD sessions.

## Design
The user will begin by logging in
![Login](assets/Login.png)
Next, they will be taken to a dashbord which lists all of the soundboards they own
![Dashboard](assets/Dashboard.png)
Each soundboard is composed of a list of sound files that can be played by tapping them
![Soundboard](assets/Soundboard.png)
### User Interaction
Here is an example of how the users will interact with the application. When a change is made to a soundboard, it will be instantly reflected on all other clients that are also observing that soundboard. This will be accomplished using websockets
![WebSocket](assets/WebSocket.png)
### This is a quick sketch of the database for this application:
- A user can have many boards
- A board can have many users
- A board can have many items
- Sound files will be stored in a public S3 bucket (without privacy rules for simplicity's sake) and will be referenced by url in the item entries of the database

![Database Design](assets/DatabaseDesign.png)

## Key Features
- Ability to securely log in over HTTPS
- Users can create soundboards and invite their friends
- All changes will be reflected on each client in real time
- Sounds can be uploaded and will be stored in the cloud
- Sounds can be played and paused by tapping on the squares

## Technologies
The required technologies will be used in the following ways.
- **HTML** - Uses HTML to structure application. There will be 3 pages: log in, dashboard, soundboard page. Hyperlinks will be used for navigation.
- **CSS** - Application will have responsive design for small and large screens. Colors and fonts will look nice, although the application will have a very basic look.
- **Javascript** - Functionality for: log in, displaying / filtering soundboards and sounds, controlling sound playback, uploading sounds to cloud, CRUD operations for soundboards and sounds.
- **Service** - Backend service with endpoints for:
  - Create, Read, Update, Delete soundboards
  - Create, Read, Update, Delete soundboard items
  - Upload sound file
- **DB** - Store users, soundboards, sounds (items)
- **BONUS: S3 Bucket** - Store sound files in cloud
- **Login** - Register and login users. Credentials securely stored in database. Can't view / edit soundboard unless logged in and are added to the soundboard.
- **WebSocket** - As a soundboard is edited, all changes will be broadcast to other users of that soundboard.
- **React** - Application will eventually use the React framework

## HTML Deliverable
For this deliverable I built out the structure of the application in HTML
- **HTML Pages** - Login, About, Soundboards (dashboard), and an example Soundboard page
- **Links** - The login page automatically links to the Soundboards page. There is a navbar with links to all the pages
- **Text** - The Soundboards and sounds within them are represented by a text-based depictions
however they will be more colorful and structured when we do the css deliverable.
- **Images** - There is an inspiring image on the about page for users to be inspired by
- **Login** - Input box and submit button for username and password
- **Database** - The soundboards will be stored in the database for each user
- **External service** - The sounds themselves will be hosted on AWS S3
- **WebSocket** - The sounds on each soundboard will update automatically on each client when
changes are made by using WebSocket connections