// Импортируем необходимые модули
const uuid = require("uuid");
// Генерация уникальных идентификаторов
const path = require("path");
// Работа с путями файловой системы
const { Product, Type, SubType, sequelize } = require("../models/models");
// Импорт моделей
const ApiError = require("../error/ApiError");
// Обработка ошибок API
const { unlink } = require("fs").promises;
// Удаление файлов
const { Op } = require("sequelize");
// Операторы Sequelize
const xl = require("exceljs");
// Работа с Excel файлами

// Функция для парсинга Excel файла
const parse = async (fileName) => {
	// Создаем новый экземпляр рабочей книги
	const workbook = new xl.Workbook();
	// Читаем файл Excel
	await workbook.xlsx.readFile(fileName);
	// Получаем первый лист
	const worksheet = workbook.getWorksheet(1);

	// Временный список для хранения данных
	const tempList = [];
	// Список типов
	const typeList = [];
	// Список подтипов
	const subTypeList = [];
	// Список продуктов
	const productList = [];

	// Обрабатываем каждую строку в листе
	worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
		// Пропускаем первые 15 и последние 14 строк
		if (rowNumber > 15 && rowNumber < worksheet.rowCount - 14) {
			// Получаем цвет шрифта ячейки
			const color = row.getCell(3).font.color;
			// Определяем класс элемента по цвету
			const itemClass = color
				? color.argb === "FF800000"
					? "type"
					: color.argb === "FF008000"
					? "subType"
					: "product"
				: "product";
			// Добавляем элемент в временный список
			tempList.push({
				// Номер строки
				index: rowNumber,
				// Значения строки
				body: row.values,
				// Класс элемента
				class: itemClass,
			});
		}
	});

	// Временная переменная для типа
	let tempType = "";
	// Временная переменная для подтипа
	let tempSubType = "";

	// Обрабатываем временный список
	tempList.forEach(({ body, class: itemClass }) => {
		// Если это тип
		if (itemClass === "type") {
			// Устанавливаем временный тип
			tempType = body[3];
			// Добавляем тип в список типов
			typeList.push(tempType);
			// Сбрасываем временный подтип
			tempSubType = "-";
		} else if (itemClass === "subType") {
			// Устанавливаем временный подтип
			tempSubType = body[3];
			// Добавляем подтип в список подтипов
			subTypeList.push({ nameType: tempType, nameSubType: tempSubType });
		} else if (itemClass === "product") {
			// Добавляем продукт в список продуктов
			productList.push({
				// Артикул продукта
				article: String(body[2]),
				// Название продукта
				name: body[3],
				// Стоимость продукта
				cost: body[4] || 0,
				// Ссылка на изображение продукта
				img: body[6]?.hyperlink || "NONE",
				// Тип продукта
				type: tempType,
				// Подтип продукта
				subType: tempSubType,
			});
		}
	});

	// Возвращаем списки типов, подтипов и продуктов
	return { typeList, subTypeList, productList };
};

// Функция для добавления типов в базу данных
const addTypes = async (typeList, transaction) => {
	// Находим существующие типы в базе данных
	const existingTypes = await Type.findAll({
		// Условия поиска по именам типов
		where: { name: { [Op.in]: typeList } },
		// Используем транзакцию
		transaction,
	});
	// Получаем имена существующих типов
	const existingTypeNames = existingTypes.map((t) => t.name);
	// Фильтруем типы, которые нужно создать
	const typesToCreate = typeList.filter(
		(name) => !existingTypeNames.includes(name)
	);

	// Если есть типы для создания
	if (typesToCreate.length > 0) {
		// Создаем новые типы в базе данных
		await Type.bulkCreate(
			typesToCreate.map((name) => ({ name })),
			{ transaction }
		);
	}

	// Находим все типы в базе данных
	const allTypes = await Type.findAll({
		// Условия поиска по именам типов
		where: { name: { [Op.in]: typeList } },
		// Используем транзакцию
		transaction,
	});
	// Возвращаем объект с ID типов
	return allTypes.reduce((acc, type) => {
		// Добавляем типы в аккумулятор
		acc[type.name] = type.id;
		return acc;
	}, {});
};

// Функция для добавления подтипов в базу данных
const addSubTypes = async (subTypeList, typeIdMap, transaction) => {
	// Получаем имена подтипов
	const subTypeNames = subTypeList.map((st) => st.nameSubType);
	// Находим существующие подтипы в базе данных
	const existingSubTypes = await SubType.findAll({
		// Условия поиска по именам подтипов
		where: { name: { [Op.in]: subTypeNames } },
		// Используем транзакцию
		transaction,
	});
	// Получаем имена существующих подтипов
	const existingSubTypeNames = existingSubTypes.map((st) => st.name);

	// Фильтруем подтипы, которые нужно создать
	const subTypesToCreate = subTypeList
		.filter((st) => !existingSubTypeNames.includes(st.nameSubType))
		.map((st) => ({
			// Имя подтипа
			name: st.nameSubType,
			// ID типа
			typeId: typeIdMap[st.nameType],
		}));

	// Если есть подтипы для создания
	if (subTypesToCreate.length > 0) {
		// Создаем новые подтипы в базе данных
		await SubType.bulkCreate(subTypesToCreate, { transaction });
	}

	// Находим все подтипы в базе данных
	const allSubTypes = await SubType.findAll({
		// Условия поиска по именам подтипов
		where: { name: { [Op.in]: subTypeNames } },
		// Используем транзакцию
		transaction,
	});
	// Возвращаем объект с ID подтипов
	return allSubTypes.reduce((acc, subType) => {
		// Добавляем подтипы в аккумулятор
		acc[subType.name] = subType.id;
		return acc;
	}, {});
};

// Функция для обновления или создания продуктов в базе данных
const updateOrCreateProducts = async (
	products,
	typeIdMap,
	subTypeIdMap,
	transaction
) => {
	// Получаем артикулы продуктов
	const articles = products.map((p) => p.article);
	// Находим существующие продукты в базе данных
	const existingProducts = await Product.findAll({
		// Условия поиска по артикулам
		where: { article: { [Op.in]: articles } },
		// Используем транзакцию
		transaction,
	});

	// Массивы для обновления и создания продуктов
	const productsToUpdate = [];
	const productsToCreate = [];

	// Обрабатываем каждый продукт
	products.forEach((product) => {
		// Находим существующий продукт
		const existingProduct = existingProducts.find(
			(ep) => ep.article === product.article
		);
		// Если продукт существует, добавляем в массив обновления
		if (existingProduct) {
			productsToUpdate.push({
				// ID продукта
				id: existingProduct.id,
				// Название продукта
				name: product.name,
				// Цена продукта
				price: product.cost,
				// Изображение продукта
				img: product.img,
				// Доступность продукта
				availability: true,
			});
		} else {
			// Если продукт не существует, добавляем в массив создания
			productsToCreate.push({
				// Артикул продукта
				article: product.article,
				// Название продукта
				name: product.name,
				// Цена продукта
				price: product.cost,
				// ID типа
				typeId: typeIdMap[product.type],
				// ID подтипа
				subTypeId: subTypeIdMap[product.subType] || null,
				// Изображение продукта
				img: product.img,
				// Доступность продукта
				availability: true,
			});
		}
	});

	// Если есть продукты для обновления
	if (productsToUpdate.length > 0) {
		// Обновляем продукты в базе данных
		await Promise.all(
			productsToUpdate.map((product) =>
				Product.update(
					{
						// Название продукта
						name: product.name,
						// Цена продукта
						price: product.price,
						// Изображение продукта
						img: product.img,
						// Доступность продукта
						availability: true,
					},
					// Условия обновления
					{ where: { id: product.id }, transaction }
				)
			)
		);
	}

	// Если есть продукты для создания
	if (productsToCreate.length > 0) {
		// Создаем новые продукты в базе данных
		await Product.bulkCreate(productsToCreate, { transaction });
	}
};

// Функция для обработки продуктов по чанкам
const processChunk = async (products, typeIdMap, subTypeIdMap, transaction) => {
	// Размер чанка
	const chunkSize = 500;
	// Обрабатываем продукты по чанкам
	for (let i = 0; i < products.length; i += chunkSize) {
		// Получаем текущий чанк
		const chunk = products.slice(i, i + chunkSize);
		// Обновляем или создаем продукты в текущем чанке
		await updateOrCreateProducts(
			chunk,
			typeIdMap,
			subTypeIdMap,
			transaction
		);
	}
};

// Класс контроллера Excel
class ExcelController {
	// Метод для создания данных из Excel
	async create(req, res, next) {
		// Создаем новую транзакцию
		const t = await sequelize.transaction();
		try {
			// Получаем файл Excel из запроса
			const { excel } = req.files;
			// Генерируем уникальное имя файла
			const fileName = uuid.v4() + ".xlsx";
			// Определяем путь для временного файла
			const pathFile = path.resolve(
				__dirname,
				"..",
				"static",
				"tempExcel",
				fileName
			);

			// Перемещаем файл в временную директорию
			await excel.mv(pathFile);
			// Парсим данные из Excel файла
			const { typeList, subTypeList, productList } = await parse(
				pathFile
			);
			// Удаляем временный файл
			await unlink(pathFile);

			// Добавляем типы и получаем их ID
			const typeIdMap = await addTypes(typeList, t);

			// Добавляем подтипы и получаем их ID
			const subTypeIdMap = await addSubTypes(subTypeList, typeIdMap, t);

			// Обрабатываем продукты по чанкам
			await processChunk(productList, typeIdMap, subTypeIdMap, t);

			// Подтверждаем транзакцию
			await t.commit();
			// Возвращаем успешный ответ
			return res.json("Data processed successfully");
		} catch (e) {
			// Если произошла ошибка, откатываем транзакцию
			if (!t.finished) await t.rollback();
			// Передаем ошибку в следующий обработчик
			next(ApiError.badRequest(e.message));
		}
	}
}

// Экспортируем экземпляр контроллера Excel
module.exports = new ExcelController();
