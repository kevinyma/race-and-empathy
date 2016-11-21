#The Race and Empathy Project Software Application README

##SECTIONS
- Overview
- Auto-uploading and what it means for making changes
- Where to put images/audio files
- How to change the order of audio tiles/delete/add tiles

---------------------
###Overview
The entire project is hosted in the folder "rrr". The name of this folder can be changed without anything happening to the web application.

If any undesirable changes are made to the project, a backup version can be downloaded from https://github.com/kevinyma/race-and-empathy

Choose the "Clone or download" > "Download ZIP" option.


--------------------
###Auto-uploading and what it means for making changes
The project contains the file "sftp-config.json" which will cause any change to upload upon saving any file.

This means any changes will be visible on the web app IMMEDIATELY.

You can turn off auto-upload by opening "sftp-config.json" with notepad or your favorite text editor. 

Change the line: "upload_on_save": true,
To:
"upload_on_save": false,


---------------------
###Where to put images/audio files
Instead of putting the image/audio files inside the project, we host them online, to improve the speed at which the web page loads.

Upload the images and audio to your Google Drive or Dropbox and make sure they are shared with public.

Copy the links - we will use them in the next step.


---------------------
###How to change the order of audio tiles/delete/add tiles
Open the file "index.html"

Look for or use CTRL-F: "gallery section"

This is the part that contains all the audio tiles. An example of the code for a single audio tile:
	
~~~~html
<div class="thumbnail fade_open">
    <div class="resource">
        <img src="https://dl.dropboxusercontent.com/u/102549580/Clip01.jpg" alt="clip01">
    </div>
    <div class="caption">
        <p>Looking around during a meeting</p>
    </div>
    <!-- <a href="resource/Clip01 - affirmative action.mp3"></a> -->
    <a href="https://dl.dropboxusercontent.com/u/102549580/Clip01%20-%20affirmative%20action.mp3"></a>
</div>
	
~~~~

A single tile begins with the tag ```<div class="thumbnail fade_open">``` and ends with ```</div>```

Tiles populate the web app left to right, and then top to bottom. If we change the order of the tiles in the code they will change in the web app.

To replace a tile we change the following parts of an existing file:

We change ```<img src="https://dl.dropboxusercontent.com/u/102549580/Clip01.jpg" alt="clip01">```
into:
```<img src="(link where I am hosting the image file)" alt="(unique identifier for this tile, for the archive)">```

And then we change ```<a href="https://dl.dropboxusercontent.com/u/102549580/Clip01%20-%20affirmative%20action.mp3"></a>```
into:
```<a href="(link where I am hosting the audio file)"></a>```

After these links have been changed, reload the web application, and you will see the changes.









