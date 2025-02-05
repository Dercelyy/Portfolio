<?php

	// Включение локализации
	require('ozon.api.class.php');

	// Создаем запросы
	$site = new Ozon_api();

	// Запускаем генерацию страницы
	echo $site->run();

