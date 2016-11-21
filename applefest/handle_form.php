<?php
// Start the session
session_start();
?>

<!DOCTYPE html>

<html>
	<head>
		<title>APPLEFEST 2014</title>
		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link rel="icon" type="image/png" href="images/icon.png">

	</head>
	
	<body class="feedback">
		<div class="wrapper">
			<?php
			
				include "php/header.php"
			
			?>
			
			<div class="title">
				<h1>Feedback</h1>
			</div> 
			<div class="handleformBackground">
			<br>
					<div class="feedbackbox">


					<?php
					
					$email_message="";
					if ($_SESSION["email"]!=""){
						$email_message="<p class=\"thanks\">You will receive future notifications about the festival at ".$_SESSION["email"].".</p>";
					}
					echo "<h2 class=\"thanks\">Thanks for your input!</h2><br>";
					echo  $email_message;
					
				
					?>

				</div>
			</div>
			<div class="push">
			</div>
		</div>
		
			<?php
				include "php/footer.php"
			
			?>
	</body>
</html>