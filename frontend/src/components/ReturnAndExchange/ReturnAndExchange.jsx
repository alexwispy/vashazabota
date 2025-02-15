// src/components/ReturnAndExchange/ReturnAndExchange.jsx
import React from 'react';
import './ReturnAndExchange.css';

const ReturnAndExchange = () => {
	return (
		<div className="return-and-exchange">
			<h1>Условия обмена и возврата товаров</h1>

			<h2>1. Общие положения</h2>
			<p>
				Мы прилагаем максимальные усилия для того, чтобы товары, представленные в нашем интернет-магазине, полностью
				соответствовали вашему заказу. В случае, если товар оказался некачественным, либо вы изменили свое решение о
				покупке, вы имеете право на возврат или обмен товара в соответствии с законодательством Российской Федерации.
			</p>

			<h2>2. Возврат товаров ненадлежащего качества</h2>
			<p>
				В случае, если товар оказался ненадлежащего качества (не соответствует описанию, поврежден или неработоспособен),
				вы имеете право на возврат товара и обмен на аналогичный или возврат уплаченной суммы. Возврат товара ненадлежащего
				качества возможен в течение 14 дней с момента получения товара.
			</p>

			<h2>3. Возврат товаров надлежащего качества</h2>
			<p>
				В соответствии с законодательством РФ, товары, обладающие определенными гигиеническими свойствами, такие как
				косметические средства, не подлежат возврату или обмену, если они были вскрыты или использованы. Обмен и возврат
				возможен только в случае, если товар не был использован, сохранены все упаковки, ярлыки и товарный вид.
			</p>

			<h2>4. Исключения из правил возврата</h2>
			<p>
				Согласно статье 26.1 Закона о защите прав потребителей, товары, подлежащие возврату и обмену, должны быть в
				неизменном виде, с сохранением товарного вида. Косметика и парфюмерия не подлежат возврату и обмену после вскрытия
				упаковки, если товар не имеет дефектов.
			</p>

			<h2>5. Процедура возврата товара</h2>
			<p>
				Для возврата товара, пожалуйста, свяжитесь с нашей службой поддержки по телефону или электронной почте и
				предоставьте информацию о заказе, а также фотографии товара и его дефектов (если таковые имеются). Мы обработаем
				ваш запрос в течение 3 рабочих дней.
			</p>

			<h2>6. Возврат денежных средств</h2>
			<p>
				В случае возврата товара ненадлежащего качества, средства будут возвращены на вашу карту или другой способ оплаты в
				течение 10 рабочих дней после получения товара обратно. Возврат денег осуществляется после проверки состояния товара.
			</p>

			<h2>7. Косметические средства, не подлежащие возврату</h2>
			<p>
				В соответствии с действующим законодательством РФ, возврат косметических средств возможен только в случае, если
				товар имеет дефекты, если упаковка не вскрыта, и если товар не был использован. Все товары, которые были вскрыты или
				использованы, возврату не подлежат.
			</p>

			<h2>8. Обмен товаров</h2>
			<p>
				Если товар был доставлен в ненадлежащем качестве или вы получили неправильный товар, мы обменяем его на аналогичный
				или вернем деньги в полном объеме. В случае обмена на аналогичный товар, доставка будет оплачена нашей компанией.
			</p>
		</div>
	);
};

export default ReturnAndExchange;
