# 'minder app API
This is the API for my ['minder app](https://minder-app.vercel.app/) as part of my first fullstack project for my Software Engineering program at Thinkful.

The live app can be found at https://minder-app.vercel.app/

## Documentation
Base URL: 'https://fathomless-chamber-84986.herokuapp.com/api/'

### Show All Reminders
Returns json data with all stored reminders.

* URL

    /reminders

* Method:

    `GET`

* URL Params

    none

* Data Params

    none

* Success Response:

    * Code: 200  
      Content: 
            [
                {   
                    "id": 1,
                    "title": "Reminder 1",
                    "due_date": "2021-04-19T00:39:57Z"
                    "reminder_notes": "",
                    "completed": false,
                    "user_id": 1
                },
                {   
                    "id": 2,
                    "title": "Reminder 2",
                    "due_date": "2021-03-05T09:39:57Z"
                    "reminder_notes": "some notes",
                    "completed": true,
                    "user_id": 1
                },
            ]

* Error Response:
    * Only expected error response will be 500 server error

* Sample Call:

      $.ajax({
        url: "/reminders",
        dataType: "json",
        type : "GET",
        success : function(res) {
            var reminders = jQuery.parseJSON(res);
            console.log(reminders);
        }
      });


### Show Reminder
Returns json data with specified reminder.

* URL

    /reminders/:reminderId

* Method:

    `GET`

* URL Params

    `reminderId=[integer]`

* Data Params

    none

* Success Response:

    * Code: 200   
      Content: 
            { 
                "id": 1,
                "title": Reminder 1",
                "due_date": "2021-04-19T00:39:57Z"
                "reminder_notes": "",
                "completed": false,
                "user_id": 1
            }

* Error Response:
    * Code: 404  
      Content     `error: { message: 'Reminder does not exist'}`

* Sample Call:

      $.ajax({
         url: "/reminders",
         dataType: "json",
         type: "GET",
         success: function(res) {
            var reminder = jQuery.parseJSON(res);
            console.log(reminder);
         }
      });

### Add Reminder
Creates new reminder.

* URL

    /reminders

* Method:

    `POST`

* URL Params

    none

* Data Params
    * Content-Type: application/json
    * Body:
            {
              "title": STRING,
              "due_date": DATE STRING,
              "reminder_notes": STRING,
              "completed": BOOL,
              "user_id": 1      
            } 
        * **Only** reminder_notes is **optional**
        * Title, due_date, completed, and user_id MUST NOT BE NULL
        * **user_id: 1** required for current demo stage of app, only this single default dummy user currently in use

* Success Response:

    * Code: 201  
      Content: 
           {
                "id": 1,
                "title": "Reminder 1",
                "due_date": "2021-04-19T00:39:57Z"
                "reminder_notes": "",
                "completed": false,
                "user_id": 1,    
            } 

* Error Response:
    * Code: 400  
      Content     `error: { message: Missing  in request body' }`

* Sample Call:

      $.ajax({
        url : "/reminders",
        type: "POST",
        data: JSON.stringify([
              {
                "id": 1,
                "title": "Reminder 1",
                "due_date": "2021-04-19T00:39:57Z"
                "completed": false,
                "user_id": 1,
              } 
        ]),
        contentType: "application/json",
        dataType: "json",
        success: function(res) {
            var new = jQuery.parseJSON(res);
            console.log(new);
        }
      });


### Delete Reminder
Deletes specified reminder.

* URL

    /reminders/:reminderId

* Method:

    `DELETE`

* URL Params

    `reminderId=[integer]`

* Data Params

    none

* Success Response:

    * Code: 204  No Content

* Error Response:

    * Code: 404  
      Content     `error: { message: 'Reminder does not exist'}`

* Sample Call:

      $.ajax({
         url: "/reminders/1",
         type : "DELETE",
         success : function() {
            //callback function, confirmation alert, etc.
         }
      });


### Edit Reminder
Updates specified reminder with supplied data.

* URL

    /reminders/:reminderId

* Method:

    `PATCH`

* URL Params

    **Required**
    `reminderId=[integer]`

* Data Params

    * Content-Type: application/json
    * Body:
            {
              "title": STRING,
              "due_date": DATE STRING,
              "reminder_notes": STRING,
              "completed": BOOL,    
            } 
        * MUST CONAIN ONE OF: TITLE, DUE_DATE, OR COMPLETED (MUST NOT BE NULL)


* Success Response:

    * Code: 204   No content


* Error Response:
    * Code: 400  
      Content     `error: { message: 'Body must contain one of: title, due_date, or completed' }`

* Sample Call:

      $.ajax({
        url : "/reminders/1",
        type: "PATCH",
        data: JSON.stringify([
              {
                "title": "Updated Reminder 1",
                "reminder_notes": "updated!",
              } 
        ]),
        contentType: "application/json",
        success: function() {
            //callback function, confirmation alert, etc.
        }
      });




## Tools
This REST API was made using
* Express.js
* Node.js
* Heroku PostgreSQL database

