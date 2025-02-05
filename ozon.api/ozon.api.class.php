	<?php
	//---------------------------------------------------------------------------
	// Класс электронных кошельков
	class Ozon_api
	{
		// Документация: https://docs.ozon.ru/api/seller
		//---------------------------------------------------------------------------
		// Конструктор
		public function __construct()
		{

		}
		//---------------------------------------------------------------------------
		// Запуск
		function run()
		{
			$this->tree_description_category_get();
		}
		//---------------------------------------------------------------------------
		// Список товаров
		public function list_products_get()
		{
			// URL для отправки запроса
			$url = 'https://api-seller.ozon.ru/v2/product/list';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = array(
				'filter' => array(
					'visibility' => 'ALL'
				),
				'last_id' => '',
				'limit' => 100,
			);
			//---------------------------------------------------------------------------
			// Получение ответа
			$response = $this->send_curl($request_data, $url);

			$this->save_file(__FUNCTION__, $response);
			var_dump($response);
		}
		//---------------------------------------------------------------------------
		// Информация о товарах
		public function info_product_get()
		{
			// URL для отправки запроса
			$url = 'https://api-seller.ozon.ru/v2/product/info';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = array(

				'offer_id' => '',
				'product_id' => 1026852100,
				'sku' => 0
			);
			//---------------------------------------------------------------------------
			// Получение ответа
			$response = $this->send_curl($request_data, $url);

			$this->save_file(__FUNCTION__, $response);
			var_dump($response);
		}
		//---------------------------------------------------------------------------
		// Получить список товаров по идентификаторам
		public function info_list_product_get()
		{
			// URL для отправки запроса
			$url = 'https://api-seller.ozon.ru/v2/product/info/list';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = array(

				"offer_id" => array(),
				"product_id" => array(
					'1026852100',
					'1026852157',
					'1026852171'
				),
				"sku" => array()
			);
			//---------------------------------------------------------------------------
			// Получение ответа
			$response = $this->send_curl($request_data, $url);

			$this->save_file(__FUNCTION__, $response);
			var_dump($response);
		}
		//---------------------------------------------------------------------------
		// Получить список атрибутов товара по идентификаторам
		public function attributes_product_get()
		{
			// URL для отправки запроса
			$url = 'https://api-seller.ozon.ru/v3/products/info/attributes';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = array(

				'filter' => array(
						'product_id' => array(
							'1026852100',
							'1026852157',
							'1026852171'
						),
						'visibility' => 'ALL'
					),
					'limit' => 100,
					'last_id' => '',
					'sort_dir' => 'DESC'
			);
			//---------------------------------------------------------------------------
			// Получение ответа
			$response = $this->send_curl($request_data, $url);

			$this->save_file(__FUNCTION__, $response);
			var_dump($response);
		}
		//---------------------------------------------------------------------------
		// Дерево категорий и типов товаров
		public function tree_description_category_get()
		{
			// URL для отправки запроса
			$url = 'https://api-seller.ozon.ru/v1/description-category/tree';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = array(

				'language' => 'DEFAULT'
			);
			//---------------------------------------------------------------------------
			// Получение ответа
			$response = $this->send_curl($request_data, $url);

			$this->save_file(__FUNCTION__, $response);
			var_dump($response);
		}
		//---------------------------------------------------------------------------
		//---------------------------------------------------------------------------
		// Дерево категорий и типов товаров
		public function attribute_description_category_get()
		{
			// URL для отправки запроса
			$url = 'https://api-seller.ozon.ru/v1/description-category/attribute';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = array(

				"description_category_id" => 200000933,
				"language" => "DEFAULT",
				"type_id" => 93080
			);
			//---------------------------------------------------------------------------
			// Получение ответа
			$response = $this->send_curl($request_data, $url);

			$this->save_file(__FUNCTION__, $response);
			var_dump($response);
		}
		//---------------------------------------------------------------------------
		// Отправить запрос
		public function send_curl(array $request_data, string $url)
		{
			// Преобразуем данные в формат JSON
			$json_data = json_encode($request_data);

			// Инициализируем cURL сессию
			$curl_handle = curl_init();

			$client_id = '1603552';
			$api_key = 'abfb900c-cc9f-4cba-b1ef-e48e04b50041';

			// Устанавливаем параметры запроса
			curl_setopt($curl_handle, CURLOPT_URL, $url);
			curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl_handle, CURLOPT_POST, true);
			curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $json_data);
			curl_setopt($curl_handle, CURLOPT_HTTPHEADER, [
				'Client-Id: ' . $client_id,
				'Api-Key: ' . $api_key,
				'Content-Type: application/json',
			]);

			// Выполняем запрос
			$response = curl_exec($curl_handle);

			// Ошибка
			$curl_error = curl_error($curl_handle);

			echo('Ошибка: ' . print_r($curl_error, true) . "<br>");

			// Закрываем cURL сессию
			curl_close($curl_handle);

			return json_decode($response, true);
		}
		//---------------------------------------------------------------------------
		// Сохранить ответ
		public function save_file($function, $response)
		{
			file_put_contents('./txt/' . $function . '.txt', print_r($response, true));
		}
		//---------------------------------------------------------------------------

	}
