const { BasketProduct, Product, sequelize } = require('../models/models')
const { Op } = require('sequelize')
const ApiError = require('../error/ApiError')

// Поиск продукта по ID в корзине
const findProductBasket = async productId => {
	return await Product.findOne({
		where: { id: productId }
	});
}

class BasketController {

	// Создание новой корзины
	create = async (req, res, next) => {
		// Инициализация транзакции
		const t = await sequelize.transaction();

		try {
			// Получение параметров
			const { userId, productId, count = 1, cost } = req.body;

			// Проверка на наличие товара в корзине
			const goodsCheck = await BasketProduct.findOne({
				where: {
					[Op.and]: [
						{ userId: userId },
						{ productId }
					]
				}
			});

			// Если товар не найден, создаем новый элемент в корзине
			if (!goodsCheck) {
				await BasketProduct.create({
					userId: userId,
					productId,
					count,
					cost,
				}, { transaction: t });
			}
			// Если товар найден,
			else {
				// Если товар найден, обновляем его количество и стоимость
				await BasketProduct.update(
					{
						count: +goodsCheck.count + +count,
						cost: Number(+cost + +goodsCheck.cost).toFixed(2)
					},
					{
						where: {
							[Op.and]: [
								{ userId: userId },
								{ productId }
							]
						},
						transaction: t
					}
				);
			}

			// Подтверждаем транзакцию
			await t.commit();

			// Возвращаем обновленные данные корзины
			return this.getBasketItems(userId, res);
		}
		catch (error) {
			// В случае ошибки откатываем транзакцию, если она еще не завершена
			if (!t.finished) {
				await t.rollback();
			}
			next(ApiError.badRequest(error.message));
		}
	}
	// Получение всех товаров
	getAll = async (req, res, next) => {
		// Получение параметров
		const { userId } = req.query;

		try {
			// Возвращаем данные корзины
			return this.getBasketItems(userId, res);
		}
		catch (error) {
			next(ApiError.badRequest(error.message));
		}
	}
	// Удалить один товар из корзины
	async deleteOne(req, res, next) {
		// Получение параметров
		const { id } = req.query;
		// Инициализация транзакции
		const t = await sequelize.transaction();

		try {
			// Удаление товара из корзины в рамках транзакции
			await BasketProduct.destroy({
				where: { id },
				transaction: t
			});

			// Подтверждение транзакции
			await t.commit();

			// Вернуть результат
			return res.json({ message: 'Product deleted successfully' });
		}
		catch (error) {
			// В случае ошибки откатываем транзакцию
			await t.rollback();
			next(ApiError.badRequest(error.message));
		}
	}
	// Удалить все товары из корзины
	async deleteAll(req, res, next) {
		// Получение параметров
		const { userId } = req.query;
		// Инициализация транзакции
		const t = await sequelize.transaction();

		try {

			// Удаление всех товаров из корзины в рамках транзакции
			await BasketProduct.destroy({
				where: { userId: userId },
				transaction: t
			});

			// Подтверждение транзакции
			await t.commit();

			// Вернуть результат
			return res.json({ message: 'All products deleted successfully' });
		}
		catch (error) {
			// В случае ошибки откатываем транзакцию
			await t.rollback();
			next(ApiError.badRequest(error.message));
		}
	}
	// Изменить кол-во товаров
	editCount = async (req, res, next) => {
		// Получение параметров
		const { userId, productId, count = 1 } = req.body;
		// Инициализация транзакции
		const t = await sequelize.transaction();

		try {
			// Найти товар по ID товара и ID пользователя
			const goodsCheck = await BasketProduct.findOne({
				where: {
					userId,
					productId
				}
			});

			// Если товар не найден, вернуть пустой ответ
			if (!goodsCheck) {
				return res.json([]);
			}

			// Добавить N-количество к счётчику у товара
			await BasketProduct.update({
				count: count,
				cost: Math.round(Number((goodsCheck.cost / goodsCheck.count) * + count))
			},
			{
				where: {
				[Op.and]: [
					{ userId: userId },
					{ productId: productId }
				]
				},
				transaction: t
			});

			// Подтверждаем транзакцию
			await t.commit();

			// Вернуть весь список корзины
			return this.getBasketItems(userId, res);
		}
		catch (error) {
			// В случае ошибки откатываем транзакцию
			await t.rollback();
			next(ApiError.badRequest(error.message));
		}
	}
	// Получение всего списка товаров из корзины для одного пользователя
	async getBasketItems(userId, res) {
		try {
			// Получить корзину пользователя
			const cart = await BasketProduct.findAll({
				where: { userId },
				order: [['id', 'ASC']],
			});

			// Для каждого товара, получить их данные
			const basketData = await Promise.all(cart.map(async (value) => {
				const prod = await findProductBasket(value.productId);
				return {
					product: prod,
					id: value.id,
					count: value.count,
					cost: value.cost,
				};
			}));

			// Вернуть весь массив
			return res.json(basketData);
		}
		catch (error) {
			throw new ApiError.badRequest(error.message);
		}
	}
}

module.exports = new BasketController();
