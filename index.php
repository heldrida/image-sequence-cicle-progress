<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1, maximum-scale=1">
	<link rel="stylesheet" href="css/app.css">
</head>
<body>

	<div class="image-sequencer-box">

		<div class="progress-container">

			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="-8 -8 600 600" preserveAspectRatio="xMinYMin">
				<!--
				<path class="path" stroke="#333333" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke-dasharray="500" stroke-dashoffset="500" fill="none" d="M335 38.9c-43.7 0-79.1 35.4-79.1 79.1s35.4 79.1 79.1 79.1 79.1-35.4 79.1-79.1-35.4-79.1-79.1-79.1z"/>
				-->
				<path d="M584,291 C584,451.715 453.715,582 293,582 C132.285,582 2,451.715 2,291 C2,130.285 132.285,0 293,0 C453.715,0 584,130.285 584,291 L584,291 Z" stroke="#333333" fill="none"/>
				<path class="circle-path" d="M584,291 C584,451.715 453.715,582 293,582 C132.285,582 2,451.715 2,291 C2,130.285 132.285,0 293,0 C453.715,0 584,130.285 584,291 L584,291 Z" stroke="#333333" stroke-width="8" stroke-linejoin="round" stroke-linecap="flat" stroke-dasharray="500" stroke-dashoffset="500" fill="none" />
			</svg>

			<div class="pointer">
				<svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
					<path d="M14.783 8.792c0 3.188-2.585 5.773-5.774 5.773-3.19 0-5.774-2.585-5.774-5.773 0-3.19 2.585-5.774 5.773-5.774 3.188 0 5.773 2.585 5.773 5.774z" stroke="#555" stroke-width="5" fill="#000000" fill-rule="evenodd"/>
				</svg>
			</div>

		</div>

		<div class="images-container">
			<?php for ($i = 1; $i <= 342; $i++) : ?>
				<?php if ($i < 10) : ?>
				<img src="img/720x576_optim/<?php echo '000' . $i; ?>.jpg" data-index="<?php echo $i ?>">
				<?php elseif ($i < 100) : ?>
				<img src="img/720x576_optim/<?php echo '00' . $i; ?>.jpg" data-index="<?php echo $i ?>">
				<?php else : ?>
				<img src="img/720x576_optim/<?php echo '0' . $i; ?>.jpg" data-index="<?php echo $i ?>">
				<?php endif; ?>
			<?php endfor; ?>
		</div>

	</div>

	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/modernizr/2.8.3/modernizr.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/hammer.js/2.0.4/hammer.min.js"></script>
	<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery.imagesloaded/3.1.8/imagesloaded.pkgd.js"></script>
	<script type="text/javascript" src="js/app.js"></script>

</body>
</html>