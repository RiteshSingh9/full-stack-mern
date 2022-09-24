# SERVER


## Routes

##### Base Url Development

    **http://localhost:4000/**

##### Base Url Production

    **https://youdomain.com/**


##### Routes api

###### authentication

- **POST  ->  /api/auth/register** 
- **POST  ->  /api/auth/login**
- **POST  ->  /api/auth/logout**

###### Todos

- **GET    -> /api/todos/**
- **GET    -> /api/todos/:id**
- **POST   -> /api/todos/create**
- **PUT    -> /api/todos/:id** 
- **DELETE -> /api/todos/:id**



## Response structure

**success**
res.json({
    status: 'ok',
    statusCode: 200,
    data: {}
})

**serverError or notFound**
res.status(err.status).json({
    status: err.staus || 500,
    message: err.message || 'Internal Server Error'
})

**other errors**
eg: data not found, invalid credentials etc.
res.json({
    status: 'error',
    message: err.message
})