Welcome to My HW2 Submission!

Who: David Premkumar's Work. Professor Allgood's Class!

What: A Flask Application that allows users to interact with a database of student
names, id's and scores on a webpage.

When: Submitted 2/29/2024

Where: UMBC - CMSC447

How: 

    HOW TO RUN: 

        I made it very simple. If you can see this, you've already extracted it (and if you haven't,
        please do it). In the same directory as this readme (cmsc447-hw2-sp2024-premkumar-david),
        
        You have 4 choices for starting the File
        
        1. just click and run the
        "runHW2.bat" File in file explorer
        2. If in command prompt, run the "runHW2.bat" file instead
        
        Those 2 ways will automatically actuate the virtual environment I put in this folder and run it with the
        python installation in that venv.

        But, if you have a new python version installed in your machine and pip installed sqlite3 and flask,
        you should also be able to ...

        3. Just run access.py with python.

        This might be needed if grading on Linux. But otherwise option 1 (and 2) are there to make it easy on 
        windows.

        If you want to Do it the long way

        4. Go into the same directory as the read me in command prompt then enter the following
            ->venv\Scripts\activate
            ->python access.py

           This is exactly what the bat script does.

    AFTER DOING 1 OF THE 4 ABOVE - Go to "http://localhost:5000/" on your browser and the application should be there!

    HOW TO USE: 
        Let's Do this One by One. The database starts out with default data in a table.

        Add a Student: Enter Their Name, Id and Score (Id and Score must be all digits) into their
        respective fields into the box with the add button. Hit 'Add Student' to initate the operation.
        Hit update to see the result, which will succeed unless you reuse an id or enter a 
        non-numerical id or score.

        Delete a Student: Enter their Id into the field in the box with the delete button. Hit 'Delete Student'
        to initiate the operation. Hit update to see the result, which will succeed unless the id you enter is 
        non-numerical or not the id of an existing student.

        Search for a Student: Enter either the Id, Name, or Score into the Search Field, make sure you specify
        which of the attributes you are searching for in the drop box to the right of the search button. Hit search
        to search. The table will update automatically with the results. To clear the results hit update.

        Update Table: Hit Update


        Bonus: Hit the Reset Button at the Bottom to Restore the Database to the Default 3 Students


