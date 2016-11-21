<?php
// Start the session
session_start();
?>

<!DOCTYPE html>

<html>
	<head>
		<title>APPLEFEST 2014</title>
		<!--
		<script type="text/javascript">
			function val(){
			var liked = document.getElementsByName('liked[]');
			var improved = document.getElementsByName('improved[]');
			var hasChecked1 = false;
			var hasChecked2 = false;
			
			for (var i = 0; i < liked.length; i++){
				if (liked[i].checked){
				hasChecked1 = true;
				break;
				}
			}
			for (var i = 0; i < improved.length; i++){
				if (improved[i].checked){
				hasChecked2 = true;
				break;
				}
			}
			if (hasChecked1 == false){
				alert("Please select at least one option for what you liked most.");
				return false;
			}
			if (hasChecked2 == false){
				alert("Please select at least one option for what could be improved.");
				return false;
			}
			return true;
			}
		</script>	-->	
		

		<meta charset="utf-8">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link rel="icon" type="image/png" href="images/icon.png">
		<script src='http://code.jquery.com/jquery-1.11.0.min.js'></script>
		<script src="script/feedback.js"></script>
	</head>
	
	<body class="feedback">
	
	
	
	<?php // handle_form.php
					// This page receives the data from feedback.php.
					// It will receive: title, name, email, response, comments, and submit in $_POST.

					// Create useful variables to store submission results
					$success = FALSE;
					$errors = "errors";
					
					function make_err($msg) {
						return "<div class=\"error\">$msg</div>";
					}
					
					function make_inline_err($msg) {
						return "<span class=\"error\">$msg</span>";
					}
					
					function name_set($fieldname){
						if (isset($_POST[$fieldname])){
							return $_POST[$fieldname];
						}
						return "";
					}
					
					function true_if_in($haystack, $needle){
						if (strpos($haystack, $needle)!== FALSE){
							return TRUE;
						}
						return FALSE;
					}
					
					$discoveryMethod = name_set("discoveryMethod");
					$otherDiscoveryMethod = htmlspecialchars(trim(name_set("otherDiscoveryMethod")));
					$day = name_set("day");
					$rating = name_set("rating");
					$otherLiked = htmlspecialchars(trim(name_set("otherLiked")));
					$otherImproved = htmlspecialchars(trim(name_set("otherImproved")));
					$vendorSuggestions =  htmlspecialchars(trim(name_set("vendorSuggestions")));
					$comments = htmlspecialchars(trim(name_set("comments")));
					$email = htmlspecialchars(trim(name_set("email")));
					
					//making strings from checkbox groups
					$liked = "";
					if ( isset($_POST["liked"]) ) { 
						foreach($_POST['liked'] as $likedthing) {
							$liked .= $likedthing . ", ";
						}
					}
					$liked =substr($liked, 0, -2);
					
					$improved = "";
					if ( isset($_POST["improved"]) ) { 
						foreach($_POST['improved'] as $improvedthing) {
							$improved .= $improvedthing . ", ";
						}
					}
					$improved = substr($improved, 0, -2);		
					
					// Create a variable for each error location in the form.
					$discoveryMethod_err="";
					$other_discoveryMethod_err="";
					$day_err="";
					$rating_err="";
					$liked_err="";
					$other_liked_err="";
					$improved_err="";
					$other_improved_err="";
					$vendorSuggestions_err="";
					$comments_err="";
					$email_err="";
				
					
					if ( isset($_POST["submit"]) ){
					
						$success = TRUE;
						$_SESSION["email"]=$email;
					
						//Discovery method must be specified. 
						if ($discoveryMethod == ""){
							$discoveryMethod_err=make_err("Please choose an option.");
						}
						
						//If other is chosen the input field must be filled in.
						if ($discoveryMethod == "other" && $otherDiscoveryMethod==""){
							$other_discoveryMethod_err=make_inline_err("Please elaborate on how you found out about us.");
						}
						
						//Day must be specified
						if ($day == ""){
							$day_err=make_err("Please select the day you attended the festival.");
						}
						
						//Rating must be specified
						if ($rating == "") {
							$rating_err=make_err("Please choose a rating.");
						}
						
						//User must specify what they liked the most. 
						if ($liked == "") {
							$liked_err=make_err("Please tell us what you liked most about Applefest this year");
						}
						
						//If other is chosen the input field must be filled in.
						if (strpos($liked,"other")!==FALSE && $otherLiked==""){
							$other_liked_err=make_inline_err("Please elaborate on what you liked.");
						}
						
						//User must specify what they liked the most. If other is chosen the input field must be filled in.
						if ($improved == "") {
							$improved_err=make_err("Please tell us what could be improved the most about Applefest this year");
						}
						
						//If other is chosen the input field must be filled in.
						if (strpos($improved,"other")!==FALSE && $otherImproved==""){
							$other_improved_err=make_inline_err("Please elaborate on what could be improved.");
						}
						
						//email must be a valid email
						if ($email!="" && !filter_var($email, FILTER_VALIDATE_EMAIL)){
							$email_err=make_err("Please submit a valid email");
						}
						
					}
					
					//if form is submitted and there are no errors, then successful
					$error_exists = $discoveryMethod_err || $day_err || $rating_err || $liked_err
					|| $improved_err || $vendorSuggestions_err || $comments_err || $email_err ;
    
					$success = ! $error_exists && $success;
					
					//go to handle_form.php if successful
					if ($success){
						header('Location: handle_form.php');
					}
					
					//sticky form
					if (! $success) {
					
						// prepare general error message.
						$error_header = "";
						if ( $error_exists ) { 
							$error_header ="<h2 class=\"error\">Please correct the errors in red</h2>";  
						}
						
						//make discovery method radio buttons sticky
						$wordofmouth_chk = ( $discoveryMethod == "wordofmouth" ) ? "checked" : "" ;
						$festivalwebsite_chk = ( $discoveryMethod == "festivalwebsite" ) ? "checked" : "" ;
						$anotherwebsite_chk = ( $discoveryMethod == "anotherwebsite" ) ? "checked" : "" ;
						$festivalflyer_chk = ( $discoveryMethod == "festivalflyer" ) ? "checked" : "" ;
						$discover_other_chk = ( $discoveryMethod == "other" ) ? "checked" : "" ;
						
						//make day drop down selection sticky
						$friday_select = ( $day == "friday" ) ? 'selected="selected"' : '' ;
						$saturday_select = ( $day == "saturday" ) ? 'selected="selected"' : '' ;
						$sunday_select = ( $day == "sunday" ) ? 'selected="selected"' : '' ;
						
						//make rating radio buttons sticky
						$one_chk = ( $rating == "1" ) ? "checked" : '' ;
						$two_chk = ( $rating == "2" ) ? "checked" : '' ;
						$three_chk = ( $rating == "3" ) ? "checked" : '' ;
						$four_chk = ( $rating == "4" ) ? "checked" : '' ;
						$five_chk = ( $rating == "5" ) ? "checked" : '' ;
						$six_chk = ( $rating == "6" ) ? "checked" : '' ;
						$seven_chk = ( $rating == "7" ) ? "checked" : '' ;
						$eight_chk = ( $rating == "8" ) ? "checked" : '' ;
						$nine_chk = ( $rating == "9" ) ? "checked" : '' ;
						$ten_chk = ( $rating == "10" ) ? "checked" : '' ;						
												
						//making liked checkboxes sticky


						$food_chk = (true_if_in($liked,"food")) ? "checked" : "" ;
						$craft_chk = (true_if_in($liked, "craft")) ? "checked" : "" ;
						$performers_chk = (true_if_in($liked, "performers")) ? "checked" : "" ;
						$rides_chk = (true_if_in($liked, "rides")) ? "checked" : "" ;
						$applepie_chk = (true_if_in($liked, "applepie")) ? "checked" : "" ;
						$other_chk = (true_if_in($liked, "other")) ? "checked" : "" ;
						
						//making improvement checkboxessticky
						$improve_food_chk = (true_if_in($improved,"food")) ? "checked" : "" ;
						$improve_craft_chk = (true_if_in($improved, "craft")) ? "checked" : "" ;
						$improve_performers_chk = (true_if_in($improved, "performers")) ? "checked" : "" ;
						$improve_rides_chk = (true_if_in($improved, "rides")) ? "checked" : "" ;
						$improve_applepie_chk = (true_if_in($improved, "applepie")) ? "checked" : "" ;
						$improve_other_chk = (true_if_in($improved, "other")) ? "checked" : "" ;
						
						
					if ($discoveryMethod != ""){
						
					}
	
	
echo <<<END
	
		<div class="wrapper">
			<div class="navbar">
				<a href="index.php"><img src="images/logo.png" alt="logo"></a>
					<ul class="left">
						<li><a href="about.php">ABOUT</a></li>
						<li><a href="schedule.php">SCHEDULE</a></li>
						<li><a href="directions.php">DIRECTIONS</a></li>
						<li><a href="pictures.php">PICTURES</a></li>
						<li><a href="contact.php">CONTACT</a></li>
						<li><a href="feedback.php">FEEDBACK</a></li>
					</ul>
		</div>
			<div class="title">
				<h1>Feedback</h1>
			</div> 
			
			
			<div class="feedbackBackground">
			<br>
			
					<div class="feedbackbox">
						<h2>Filling out this short survey will help us improve Applefest in the future!</h2>
						$error_header
						<br>
						<form id="form_check" action="feedback.php" method="POST" novalidate>
						
						
						$discoveryMethod_err
						<span class="feedbackquestion">How did you first hear about the festival?</span><br>
						<input type="radio" name="discoveryMethod" value="wordofmouth" required $wordofmouth_chk>Word of mouth <br>
						<input type="radio" name="discoveryMethod" value="festivalwebsite" $festivalwebsite_chk>Festival website <br>
						<input type="radio" name="discoveryMethod" value="anotherwebsite" $anotherwebsite_chk>Another website <br>
						<input type="radio" name="discoveryMethod" value="festivalflyer" $festivalflyer_chk>Festival flyer <br>
						<input type="radio" name="discoveryMethod" value="other" $discover_other_chk>Other: 
						<input type="text" name="otherDiscoveryMethod" placeholder="Please specify" size="30" value="$otherDiscoveryMethod"> $other_discoveryMethod_err <br><br><br>
						
						$day_err
						<span class="feedbackquestion">On what day did you attend the festival?</span>
						<select name="day" required>
							<option value="">Choose</option>
							<option value="friday" $friday_select >Friday</option>
							<option value="saturday" $saturday_select>Saturday</option>
							<option value="sunday" $sunday_select>Sunday</option>
						</select><br><br><br>
						
						
						$rating_err
						<span class="feedbackquestion">Overall, how would you rate your experience at Applefest?</span><br>
						<table class="overall">
						<tr>
							<th>
							</th>
							<th>
								<label>1</label>
							</th>
							<th>
								<label>2</label>
							</th>
							<th>
								<label>3</label>
							</th>
							<th >
								<label>4</label>
							</th>
							<th>
								<label>5</label>
							</th>
							<th>
								<label>6</label>
							</th>
							<th>
								<label>7</label>
							</th>
							<th>
								<label>8</label>
							</th>
							<th>
								<label>9</label>
							</th>
							<th>
								<label>10</label>
							</th>
							<th>
							</th>
						
						</tr>
						<tr>
							<th>
								Boring
							</th>
							<th >
								<input type="radio" name="rating" value="1" required $one_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="2" $two_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="3" $three_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="4" $four_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="5" $five_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="6" $six_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="7" $seven_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="8" $eight_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="9" $nine_chk>
							</th>
							<th >
								<input type="radio" name="rating" value="10" $ten_chk>
							</th>
							<th>
								Fantastic
							</th>
						</tr>
						</table>
						<br>
						<br>
						
						$liked_err
						
						<div id="liked_check">
						<span class="feedbackquestion">What did you like most about the festival? (check all that apply)</span><br>
						<input type="checkbox" name="liked[]" value="food" $food_chk>Food/wine vendors<br>
						<input type="checkbox" name="liked[]" value="craft" $craft_chk>Craft vendors <br>
						<input type="checkbox" name="liked[]" value="performers" $performers_chk>Performances <br>
						<input type="checkbox" name="liked[]" value="rides" $rides_chk>Rides and games<br>
						<input type="checkbox" name="liked[]" value="applepie" $applepie_chk>Apple pie bake off<br>
						<input type="checkbox" name="liked[]" value="other" id="otherLiked" $other_chk>Other: <input type="text" name="otherLiked" 
						placeholder="Please specify" id="otherLikedInput"  size="30" value="$otherLiked"> $other_liked_err
						<br><br><br>
						</div>
						
						$improved_err
						<span class="feedbackquestion">What could be improved the most in next year's festival? (check all that apply)</span><br>
						<input type="checkbox" name="improved[]" value="food" $improve_food_chk>Food/wine vendors<br>
						<input type="checkbox" name="improved[]" value="craft" $improve_craft_chk>Craft vendors <br>
						<input type="checkbox" name="improved[]" value="performers" $improve_performers_chk>Performances <br>
						<input type="checkbox" name="improved[]" value="rides" $improve_rides_chk>Rides and games<br>
						<input type="checkbox" name="improved[]" value="applepie" $improve_applepie_chk>Apple pie bake off<br>
						<input type="checkbox" name="improved[]" value="other" $improve_other_chk>Other: <input type="text" name="otherImproved" 
						placeholder="Please specify" id="otherImproved" size="30" value="$otherImproved"> $other_improved_err
						<br><br><br>
						
						 <fieldset>
							<legend>Optional:</legend>
						
						$vendorSuggestions_err
						<span class="feedbackquestion">Are there any vendors, craftsmen, or performers you would like to see at next year's Applefest?</span><br>
						<textarea name="vendorSuggestions" rows="6" cols="100">$vendorSuggestions</textarea>
						<br><br>
						
						$comments_err
						<span class="feedbackquestion">Any other comments?</span><br>
						<textarea name="comments" rows="6" cols="100">$comments</textarea>
						
						<br><br><br>
						
						$email_err
						<span class="feedbackquestion">Enter your email for news about next year's Applefest!</span><br>
						<input type="email" name="email" size="45" placeholder="Enter email here" value="$email"><br>
						</fieldset>
						<br>
						<input type="submit" value="submit" name="submit" onclick="return val();"/>
						</form>
					</div>
				</div>
			</div>
END;
}

?>
			
			
			<div class="push">
			</div>
		
			<?php
				include "php/footer.php"
			
			?>
			<script type="text/javascript" src="js/script.js"></script>
	</body>
</html>