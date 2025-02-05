	<?php
	//---------------------------------------------------------------------------
	// Класс электронных кошельков
	class Cdek_pay
	{
		public string $login = '';
		public string $secret_key = '';

		public SQL $sql;
		public Log $log;

		//---------------------------------------------------------------------------
		// Конструктор
		public function __construct($sql, $log)
		{
			$this->sql = $sql;
			$this->log = $log;
		}
		//---------------------------------------------------------------------------
		// Функция - START
		function run()
		{
			$this->create_qr_code();
		}
		//---------------------------------------------------------------------------
		// Создание QR кода (POST)
		public function create_qr_code()
		{
			// URL для отправки запроса
			$url = 'https://secure.cdekfin.ru/merchant_api/sbp_qrs';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = [
				'login' => $this->login,
				// Значение подписи будет вычислено и добавлено здесь
				'signature' => '',
				'payment_order' => [
					'qr_life_time' => 60,
					'pay_for' => 'PayOrder',
					'pay_amount' => 1000,
					'currency' => 'TST',
					'receipt_details' => [
						[
							'id' => '2',
							'name' => 'Name',
							'price' => 1000,
							'quantity' => 1,
							'sum' => 1000,
							'payment_object' => 4
						]
					]
				]
			];

			// Генерация подписи
			$request_data['signature'] = $this->generate_signature($request_data['payment_order'], $this->secret_key);


			//---------------------------------------------------------------------------
			// Получение ответа и вывод
			$response = $this->send_curl($request_data, $url);

			// Парсим JSON-строку ответа в массив
			$response_array = json_decode($response, true);

			// Полученная строка с QR-изображением в формате base64
			$base64QRImage = $response_array['qr_image'];

			// Декодируем строку из base64
			$qrImageData = base64_decode($base64QRImage);

			// Создаем временный файл для сохранения QR-изображения
			$tempQRImage = tempnam(sys_get_temp_dir(), 'qrimage_');

			// ???
			file_put_contents($tempQRImage, $qrImageData);

			// Выводим QR-изображение на страницу
			echo '<img src="data:image/png;base64,' . $base64QRImage . '" alt="QR Code">';

			// Опционально можно сохранить QR-изображение на сервере
			// $outputImagePath = 'путь_к_сохранению_QR-изображения/qr_image.png';

			// ???
			// file_put_contents($outputImagePath, $qrImageData);

			// Удаляем временный файл
			unlink($tempQRImage);
		}
		//---------------------------------------------------------------------------
		// Получения списка чеков (GET)
		public function get_receipts()
		{
			$url = 'https://secure.cdekfin.ru/merchant_api/cashbox/receipts';

			$page = 1;

			// если необходимо указать номер заказа
			$order_id = 12345;

			$request_data = $request_signature = [
				'login' => $this->login,
				'signature' => '',
				'p[page]' => 1,
				'p[per_page]' => 10,
				'o[column]' => 'id',
				'o[direction]' => 'asc',
			];

			unset($request_signature['login']);
			unset($request_signature['signature']);

			// Генерация подписи
			$signature_string = $this->generate_signature($request_signature, $this->secret_key);

			$request_data['signature'] = $signature_string;

			$url_full = $url . '?' . http_build_query($request_data);

			// Получение ответа и вывод
			$response = $this->send_curl($request_data, $url_full);

			var_dump(json_decode($response, true));
		}
		//---------------------------------------------------------------------------
		// Получение ссылки на платежную форму [POST]
		public function get_link_payment_form()
		{
			// URL для отправки запроса
			$url = 'https://secure.cdekfin.ru/merchant_api/payment_orders';

			//---------------------------------------------------------------------------
			// Данные для запроса
			$request_data = [
				'login' => $this->login,
				// Значение подписи будет вычислено и добавлено здесь
				'signature' => '',
				'payment_order' => [
					'pay_for' => 'PayOrder',
					'pay_amount' => 1000,
					'currency' => 'TST',
					'receipt_details' => [
						[
							'id' => '1',
							'name' => 'Name',
							'price' => 1000,
							'quantity' => 1,
							'sum' => 1000,
							'payment_object' => 4
						]
					]
				]
			];

			// Генерация подписи
			$request_data['signature'] = $this->generate_signature($request_data['payment_order'], $this->secret_key);

			//---------------------------------------------------------------------------
			// Получение ответа и вывод
			$response = $this->send_curl($request_data, $url);

			var_dump($response);

			// Парсим JSON-строку ответа в массив
			$response_array = json_decode($response, true);


		}
		//---------------------------------------------------------------------------
		// Перевод массива в строку
		public function flatten_array(array $array, string $prefix = ''): array
		{
			//
			$result = [];

			// Пройтись по массиву
			foreach ($array as $key => $value)
			{
				// Создать префикс с ключом
				$flattenedKey = $prefix . $key;

				// Если значение - массив
				if (is_array($value))
				{
					// Если числовое значение
					if (is_numeric($key))
						// В случае, если ключ является числовым, добавляем суффикс с индексом
						$result = array_merge($result, $this->flatten_array($value, $prefix . $key . '.'));
					else
						$result = array_merge($result, $this->flatten_array($value, $flattenedKey . '.'));
				}
				else
					$result[$flattenedKey] = $value;
			}

			//
			return $result;
		}
		//---------------------------------------------------------------------------
		// Создать подпись
		public function generate_signature(array $data, string $secret_key): string
		{
			// Перевести массив в строку
			$flattened_data = $this->flatten_array($data);

			// Отсортировать по ключам
			ksort($flattened_data);

			// Перевести массив в строку
			$signature_string = implode('|', array_values($flattened_data)) . '|' . $secret_key;

			// Вернуть хэш
			return strtoupper(hash('SHA256', $signature_string));
		}
		//---------------------------------------------------------------------------
		// Отправить запрос
		public function send_curl(array $request_data, string $url)
		{
			// Преобразуем данные в формат JSON
			$json_data = json_encode($request_data);

			// Инициализируем cURL сессию
			$curl_handle = curl_init();

			// Устанавливаем параметры запроса
			curl_setopt($curl_handle, CURLOPT_URL, $url);
			curl_setopt($curl_handle, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($curl_handle, CURLOPT_POST, true);
			curl_setopt($curl_handle, CURLOPT_POSTFIELDS, $json_data);
			curl_setopt($curl_handle, CURLOPT_HTTPHEADER, array('Content-Type: application/json'));

			// Выполняем запрос
			$response = curl_exec($curl_handle);

			// Ошибка
			$curl_error = curl_error($curl_handle);

			// echo('Ошибка: ' . json_encode($curl_error) . "<br>");

			// Закрываем cURL сессию
			curl_close($curl_handle);

			return $response;
		}
		//---------------------------------------------------------------------------

	}
