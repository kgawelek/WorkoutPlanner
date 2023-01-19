# WorkoutPlanner

Training planning and analysis applications are currently very popular in the web and mobile app market. They help to train more systematically and effectively and therefore help to achieve goals. However, the available applications have various drawbacks, including the inability to plan future workouts without purchasing the paid version of the application or without having additional devices such as a smartwatch. In addition, many available apps focus on planning workouts in a sin-gle sport, which is a disadvantage for people playing sports other than those sup-ported by a particular application. The aim of the project was to design and develop a web application that allows for easy planning of training in multiple disciplines and their subsequent analysis. During the implementation of the project, technolo-gies such as Java, Spring, JHipster, Angular, PostgreSQL and Docker were used. The created application fulfils the goal and meets all the functional and non-functional requirements defined before the implementation.

## Setup database in Docker

The easiest way to setup database is to use it as Docker container. After installing Docker application, use command below with provided .yml file to run database.

```
docker-compose -f postgresql.yml up -d
```

## Running application

Setup java version to 17 and run in CMD/terminal command below:

```
java -jar workout-planner.jar
```

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

Default credentials are admin/admin for administrator and user/user for regular user.
