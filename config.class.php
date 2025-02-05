<?php

	//---------------------------------------------------------------------------
	// Класс конфигурации
	final class Config
	{
		// Массив форматов возвращаемой даты
		private array $datetime_format = array(
			0 => 'Y-m-d_H-i-s',
			1 => 'd.m.Y H:i:s'
		);

		//---------------------------------------------------------------------------
		// Конструктор
		public function __construct($default_data)
		{
			// Если такой файл не существует
			if (!file_exists(Local::site_config_name))
			{
				// Записать стандартные данные конфига
				$this->default_set($default_data);
			}
		}
		//---------------------------------------------------------------------------
		// Функция формирования строки даты и времени с микросекундами
		private function get_timestamp(int $index = 0)
		{
			// Разбиваем миллисекунды на массив через пробел
			$timestamp = explode(' ', microtime());
			// Конвертируем метку времени Unix в читаемую дату
			$datetime = date($this->datetime_format[$index], $timestamp[1]);
			// Вырезаем микросекунды - 6 знаков (миллисекунды - 3 знака)
			$microseconds = substr($timestamp[0], 2, 6);

			// Возвращаем дату и время с микросекундами
			return $datetime . '.' . $microseconds;
		}
		//---------------------------------------------------------------------------
		// Получить данные конфиг файла
		public function data_get(string $field = '')
		{
			// Получить конфиг файл
			$data = json_decode(file_get_contents(Local::site_config_name), true);

			// Если поле указано
			if ($field)
				// Получить указанный массив
				$data = $data[$field];

			// Получаем данные
			return $data;
		}
		//---------------------------------------------------------------------------
		// Записать данные конфиг файла
		public function data_set(string $field, array $data, bool $is_new = false)
		{
			// Получить данные конфига
			$config_data = $this->data_get();

			// Если это новый файл конфига
			if ($is_new)
				// Добавить данные в указанный раздел
				$config_data = $data;
			// Иначе конфиг уже заполнен
			else
				// Добавить данные в указанный раздел
				$config_data[$field] = $data;

			// Получаем данные
			return file_put_contents(Local::site_config_name, json_encode($config_data, JSON_PRETTY_PRINT));
		}
		//---------------------------------------------------------------------------
		// Записать данные конфиг файла по стандарту (пустые)
		public function default_set($default_data)
		{
			// Создать пустой файл с пустым массивом
			file_put_contents(Local::site_config_name, json_encode(array(), JSON_PRETTY_PRINT));

			// Записать данные в конфиг
			$this->data_set('', $default_data, true);
		}
		//---------------------------------------------------------------------------

	} // Класс конфигурации
	//---------------------------------------------------------------------------

?>