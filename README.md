# foundart-backend

## Description

Found Art is an app where you can  publish, search (rent or buy) art near you.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

- **Homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup

- **Sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend.

- **Login** - As a user I want to be able to log in on the webpage so that I can get back to my account

- **Logout** - As a user I want to be able to log out from the webpage so that I can make sure no one will access my account

- **Dashboard** - As a user I want to see my dashboard with the object I had rent.

- **Search** - As a user I want to be able to filter object by category.

- **List Object** - As a user I want to see the list of object.

- **Object details** - As a user I want to see the object details from the list.

- **Rent request** - As a user I want to resquest the object available.

- **Publish Object** - As a user I want to be able to publish my object.

- **Owner objects** - As a user I want to see a list of objects I published.

- **Edit objects** - As a user I want to edit an object.

- **Request info** - As a user I want to receive/send a request of object I want.

## Backlog

List of other features outside of the MVPs scope

User profile:

- see my profile
- upload my profile
- see other users profile
- list of favorite items
- posibility to create a artist profile and regular user profile. And specific profile.
- posibility to review the user.

Chat

- send/receive messages of other users.

Rent

- details of object rent

Object
-posibility to upload multi photos

Geo Location:

- posibility to do a search by geo location.

Homepage:

- ...
  in the landing page the everyone can see the object and do some search.

## ROUTES: Ejemplo de tabla de cómo debe quedar

| Method | Description  |            Test Text             |
| :----- | :----------: | :------------------------------: |
| GET    |      /       |       Renders the homepage       |
| GET    | /auth/signup | redirects to / if user logged in |
| POST   | /auth/signup | redirects to / if user logged in |

- GET /
  - renders the homepage
- GET /auth/signup
  - redirects to / if user logged in
  - renders the signup form (with flash msg)
- POST /auth/signup
  - redirects to / if user logged in
  - body:
    - username
    - name
    - adress
    - phone
    - email
    - password
    - dni
  - validation
    - fields not empty
    - user not exists
    - email valido
  - create user with encrypted password
  - store user in session
  - redirect to /dashboard
- GET /auth/login
  - redirects to / if user logged in
  - renders the login form (with flash msg)
- POST /auth/login
  - redirects to / if user logged in
  - body:
    - username
    - password
  - validation
    - fields not empty
    - user exists
    - passdword matches
  - store user in session
  - redirect to /events
- POST /auth/logout

  - body: (empty)
  - redirect to /auth/login

- GET /dashboard
  - renders the dashboard + the search form
- GET /search
  - body:
    - type
    - dates of renting
    - location
    - category
  - validation
    - fields not empty
    - Availability of object
  - redirect to results list
- GET /search/list

  - validation

    - the object doesn't have the date
    - date / city isn't empty

  - renders the result list page

- GET /search/list/:idObject

  - render the /object/detail

- POST /request

  - body:
    object ID, date start, date end
  - validation
    - fields not empty
    - valid date
  - redirect to dashboard

- GET /notifications

  - renders notification list

- GET /notifications/:id

  - renders notification

- POST /notification/:id/accept
  - body:
    state
  - redirect to /dashboard

## Models

User model

```
name: String
lastName: String
username: String
telephone: Number
email: String
password: String
address: {
  street: String,
  number: Number,
  zipcode: Number,
  city: String,
  country: String
  }
nationalId: {
  number: String,
  img: Url
  }

rent: [
  {
    objectID: ObjectID<Object>
    dateStart: Date
    dateEnd: Date
    State: String
  }
]
```

Oject model

```
owner: ObjectId<User>
name: String
category: String
type: String
description: String
price: Number
```

Rent model

```
objectID: ObjectID<Object>
dateStart: Date
dateEnd: Date
State: String
```
