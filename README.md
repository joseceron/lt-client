# lt-client project
 
# Description
 
This project is the UI to show companies catalog

 
#### Table of Contents
 
- [Frontend](#frontend)
	- [Installation](#installation)
	- [Quick Start](#quickstart)
	- [Usage](#usage)
	- [Docker](#docker)
	- [Docs](#docs)
	- [What is included](#whatisincluded)
- [Server](#server)


 
# Frontend
 
#### Installation
- [Install nvm](https://github.com/nvm-sh/nvm) in order to use different versions of node

``` bash
# clone the repo
$ git https://github.com/joseceron/lt-client.git
 
# go into app's directory
$ cd lt-client
 
# use node version 16.14.0
$ nvm install 16.14.0
$ nvm use 16.14.0
 
# install app's dependencies
$ npm install
```
 
#### Quick Start

- create the `.env` file and place it in `./` folder, add the variables:
VITE_URL=http://localhost:8000

```
lt-client
├── .env         # environment variables file
├── src/            
└── package.json
...
```

#### Usage for development
 
``` bash
# serve at localhost:8000 with automatic restart when saving
$ npm run dev
 
# Compiles and minifies for production
$ npm run build
 

```

#### Docker
 
``` bash
# 1. clone image
$ docker pull dockerjctest1/lt-vue-dev
# OR 1. build the image by your own
$ docker build -t dockerHubUser/projectName
 
# run 
$ docker run --name lt-frontend --rm -d -p 5173:5173 -it dockerjctest1/lt-vue-dev
# stop docker
$ docker stop lt-frontend

```

Keep in mind that this component points to a server so that component needs to be deployed fist.

 
#### What is included

Within the download you will find the following directories and files, logically grouping common assets and providing both compiled and minified variations. You will see something like this:

```
admiosflixweb
├── dist/                    # static files
│   └── index.html     # html template
├── conf/                  # configuration for hosting
│   └── nginx.conf     # nginx confir
│
├── src/                    # project root
│   ├── api/      		  # backend requests
│   ├── assets/         # images, icons, styles, etc.
│   ├── components/  # common components , footer, sidebar, etc.
│   ├── constants/    # centralized constants
│   ├── containers/   # The container of components
│   ├── models/        # model interfaces
│   ├── pages/         # main pages views
│   └── router/         # paths of the application
│   └── store/           # Vuex State files
│   ├── views/          # application views
│   ├── App.vue
│   └── main.ts         # main entrance file
│
└── .dockerignore.  		# Docker ignore file
└── Dockerfile.        		  # Docker commands for development
└── Dockerfile.prod.        # Docker commands for production
└── package.json            # libraries and scripts
└── README.md            # project description file
```

## Server
- Go to this [repository](https://github.com/joseceron/lt-server.git) to execute the server project
- Have in mind that the server project is required in order to run the frontend component. Because the frontend project sends the petitions to it

## Features and technologies

- bootstrap: front end css library
- firebase auth: allows multiplatform access 
- vuex: for state management
- docker: containerization
- nginx: web server
- jspdf: PDF generator
- axios: backend requests
- typescript



**Table of Contents**

[TOCM]

[TOC]
