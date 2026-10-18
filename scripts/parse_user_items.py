import re

raw_text = """
Amul Products — Brand-Wise SKU Names

Milk

1. Amul Gold Milk
2. Amul Taaza Milk
3. Amul Cow Milk
4. Amul Buffalo Milk
5. Amul Slim ’n’ Trim Milk
6. Amul Shakti Milk
7. Amul T-Special Milk
8. Amul Calci+ Milk
9. Amul Lactose-Free Milk
10. Amul UHT Gold Milk
11. Amul UHT Taaza Milk
12. Amul A2 Cow Milk
13. Amul Camel Milk

Butter, Ghee & Spreads

14. Amul Butter
15. Amul Garlic Butter
16. Amul Unsalted Butter
17. Amul Cow Ghee
18. Amul Pure Ghee
19. Amul High Aroma Cow Ghee
20. Amul Peanut Butter Creamy
21. Amul Peanut Butter Crunchy

Cheese

22. Amul Processed Cheese
23. Amul Cheese Slices
24. Amul Cheese Cubes
25. Amul Cheese Spread
26. Amul Garlic Cheese Spread
27. Amul Herbs Cheese Spread
28. Amul Mozzarella Cheese
29. Amul Pizza Cheese
30. Amul Diced Mozzarella Cheese
31. Amul Gouda Cheese
32. Amul Emmental Cheese
33. Amul Parmesan Cheese
34. Amul Cream Cheese
35. Amul High Protein Cheese

Paneer, Curd & Traditional Dairy

36. Amul Fresh Paneer
37. Amul High Protein Paneer
38. Amul Masti Dahi
39. Amul Probiotic Dahi
40. Amul High Protein Dahi
41. Amul Meetha Dahi
42. Amul Lassi
43. Amul Masti Buttermilk
44. Amul High Protein Buttermilk
45. Amul Mango Lassi
46. Amul Shrikhand
47. Amul Mango Shrikhand
48. Amul Elaichi Shrikhand
49. Amul Mishti Doi

Cream, Milk Powder & Dairy Ingredients

50. Amul Fresh Cream
51. Amul Whipping Cream
52. Amul Cooking Cream
53. Amul Dairy Whitener
54. Amulya Dairy Whitener
55. Amul Skimmed Milk Powder
56. Amul Full Cream Milk Powder
57. Amul Mithai Mate
58. Amul Sweetened Condensed Milk

Milk-Based Beverages

59. Amul Kool Koko
60. Amul Kool Badam
61. Amul Kool Kesar
62. Amul Kool Rose
63. Amul Kool Elaichi
64. Amul Kool Café
65. Amul Kool Thandai
66. Amul Kool Protein Milkshake Chocolate
67. Amul Kool Protein Milkshake Kesar
68. Amul Kool Protein Milkshake Arabica Coffee
69. Amul Kool Protein Milkshake Vanilla
70. Amul High Protein Blueberry Shake
71. Amul Mango Milkshake
72. Amul Strawberry Milkshake
73. Amul Chocolate Milkshake

Protein Products

74. Amul Whey Protein
75. Amul High Protein Milk
76. Amul High Protein Paneer
77. Amul High Protein Buttermilk
78. Amul High Protein Plain Lassi
79. Amul High Protein Rose Lassi
80. Amul High Protein Wheat Flour

Ice Creams

81. Amul Butterscotch Cone
82. Amul Choco Crunch Cone
83. Amul Two-in-One Cone
84. Amul Black Currant Cone
85. Amul Cookie Crunch Delight Cone
86. Amul Choco Vanilla Cone
87. Amul Pista Badam Cone
88. Amul Coffee Gold Tricone
89. Amul Butterscotch Bliss
90. Amul Chocolate Brownie
91. Amul Fruit ’N’ Nut Fantasy
92. Amul Golden Pearl
93. Amul King Alphonso
94. Amul Rajbhog
95. Amul Shalimar
96. Amul Haldi Ice Cream
97. Amul Pan Nawabi
98. Amul Cookies N Cream
99. Amul Choco Chips
100. Amul Afghan Dry Fruit
101. Amul Kesar Pista Royale
102. Amul American Nuts
103. Amul Kaju Draksh
104. Amul Vanilla Royale
105. Amul Strawberry Ice Cream
106. Amul Roasted Almond Tub
107. Amul Moroccan Dry Fruit Tub
108. Amul Tutti Frutti
109. Amul Butterscotch Gold
110. Amul Ice Malai
111. Amul Berry Dazzle
112. Amul Sky Scooper Cookie Overload

Chocolates & Cocoa Products

113. Amul Dark Chocolate
114. Amul 55% Dark Chocolate
115. Amul 75% Dark Chocolate
116. Amul 90% Dark Chocolate
117. Amul Milk Chocolate
118. Amul Fruit ’N’ Nut Chocolate
119. Amul Almond Chocolate
120. Amul Hazelnut Chocolate
121. Amul Single Origin Dark Chocolate
122. Amul Camel Milk Chocolate
123. Amul Chocominis
124. Amul Chocolate Coins
125. Amul Baking Chocolate
126. Amul Cocoa Powder

Cookies & Biscuits

127. Amul Butter Cookies
128. Amul Coconut Cookies
129. Amul Oats and Honey Cookies
130. Amul Nuts and Raisins Cookies
131. Amul Jeera Cookies
132. Amul Cashew Cookies
133. Amul Milletelo Cookies
134. Amul Digestive Cookies
135. Amul Shortbread Cookies
136. Amul Chocolate Cookies
137. Amul Butter Nankhatai Cashew
138. Amul Butter Nankhatai Almond
139. Amul Butter Nankhatai Elaichi
140. Amul Cheese Cookies
141. Amul High Protein Cookies

Bread & Bakery

142. Amul Sandwich Bread
143. Amul Whole Wheat Bread
144. Amul Brown Bread
145. Amul Multigrain Bread
146. Amul Fruit Bread
147. Amul Milk Bread
148. Amul Butter Pav
149. Amul Butter Bun
150. Amul Butter Pizza Base
151. Amul Elaichi Rusk
152. Amul Jeera Rusk
153. Amul Milk Rusk
154. Amul Tea Special Rusk
155. Amul Butter Cake Classic
156. Amul Butter Cake Choco Chips
157. Amul Butter Cake Fruit N Nut
158. Amul Butter Cake Choco Walnut
159. Amul Butter Toast Milk
160. Amul Butter Toast Wheat
161. Amul Butter Khakhra
162. Amul Ghee Khakhra
163. Amul Ghee Khakhra Jiralu Masala

Frozen Snacks

164. Amul French Fries
165. Amul Burger Patty
166. Amul Aloo Tikki
167. Amul Hash Brown
168. Amul Veggie Stix
169. Amul Cheese Onion Paratha
170. Amul Paneer Paratha
171. Amul Punjabi Samosa
172. Amul Paneer Samosa
173. Amul Cheese Onion Pocket
174. Amul Cheese Poppons
175. Amul Cheese Corn Nuggets
176. Amul Masala Paneer Nuggets
177. Amul Masti Dahi Tikki

Indian Sweets & Desserts

178. Amul Gulab Jamun
179. Amul Rasgulla
180. Amul Rasmalai
181. Amul Kheer
182. Amul Basundi
183. Amul Rabri
184. Amul Motichoor Laddoo
185. Amul Peda
186. Amul Milk Cake
187. Amul Kalakand
188. Amul Gulab Jamun Mix
189. Amul Dessert Mixes

Organic Staples & Pantry Products

190. Amul Organic Whole Wheat Atta
191. Amul Organic Bajra Flour
192. Amul Organic Besan
193. Amul Organic Dehraduni Basmati Rice
194. Amul Organic Basmati Rice
195. Amul Organic Sona Masoori Rice
196. Amul Organic Moong Dal
197. Amul Organic Moong Dal Chhilka
198. Amul Organic Toor Dal
199. Amul Organic Masoor Dal
200. Amul Organic Chana Dal
201. Amul Organic Red Rajma
202. Amul Organic Desi Chana
203. Amul Organic Kabuli Chana
204. Amul Organic Moong
205. Amul Organic Poha
206. Amul Organic Turmeric Powder
207. Amul Organic Ginger Powder
208. Amul Organic Sugar
209. Amul Organic Tea
210. Amul Organic Peanuts
211. Amul Organic Almonds
212. Amul Organic Goan Cashews

Instant Mixes & Convenience Products

213. Amul Elaichi Chai Instant Tea Mix
214. Amul Adrak Chai Instant Tea Mix
215. Amul Masala Chai Instant Tea Mix
216. Amul Instant Mashed Potato
217. Amul Milk Shake Premix Mango
218. Amul Milk Shake Premix Strawberry

Britannia Products

219. Britannia Good Day Butter Cookies
220. Britannia Good Day Cashew Cookies
221. Britannia Good Day Pista Badam Cookies
222. Britannia Good Day Choco Chip Cookies
223. Britannia Good Day Chunkies Chocolate
224. Britannia Good Day Chunkies Cashew
225. Britannia Good Day Chunkies Choco-Nut
226. Britannia Marie Gold
227. Britannia Marie Gold Vita Rich
228. Britannia NutriChoice Digestive
229. Britannia NutriChoice Digestive Zero
230. Britannia NutriChoice 5 Grain Digestive
231. Britannia NutriChoice Thin Arrowroot
232. Britannia NutriChoice Hi-Fibre Digestive
233. Britannia NutriChoice Essentials
234. Britannia Milk Bikis
235. Britannia Milk Bikis Atta
236. Britannia Milk Bikis Cream
237. Britannia Tiger Glucose Biscuits
238. Britannia Tiger Krunch
239. Britannia Tiger Orange Cream
240. Britannia Bourbon
241. Britannia Bourbon Cream
242. Britannia Treat Vanilla
243. Britannia Treat Orange
244. Britannia Treat Strawberry
245. Britannia Treat Chocolate
246. Britannia Treat Pineapple
247. Britannia Treat Jim Jam
248. Britannia Jim Jam
249. Britannia Little Hearts
250. Britannia 50-50 Sweet & Salty
251. Britannia 50-50 Maska Chaska
252. Britannia 50-50 Potazos
253. Britannia Time Pass Classic Salted
254. Britannia Time Pass Tangy Tomato
255. Britannia Time Pass Masala
256. Britannia Pure Magic Chocolush
257. Britannia Pure Magic Delectable
258. Britannia Pure Magic Choco Frames
259. Britannia Pure Magic Chocolate Cookies
260. Britannia Nice Time
261. Britannia Nice Time Coconut
262. Britannia Milk Cream Biscuits
263. Britannia Milk Cream Orange
264. Britannia Milk Cream Elaichi
265. Britannia Toastea Premium Bake Rusk
266. Britannia Toastea Milk Rusk
267. Britannia Toastea Jeera Rusk
268. Britannia Toastea Suji Rusk
269. Britannia Toastea Premium Milk Rusk
270. Britannia Cake Rusk
271. Britannia Gobbles Choco
272. Britannia Gobbles Vanilla
273. Britannia Gobbles Pineapple
274. Britannia Gobbles Fruit Cake
275. Britannia Gobbles Chocolate Cake
276. Britannia Gobbles Swiss Roll Chocolate
277. Britannia Gobbles Swiss Roll Vanilla
278. Britannia Gobbles Brownie
279. Britannia Fudge It Brownie
280. Britannia Treat Croissant Chocolate
281. Britannia Treat Croissant Vanilla
282. Britannia Treat Croissant Strawberry
283. Britannia 100% Whole Wheat Bread
284. Britannia White Sandwich Bread
285. Britannia Milk Bread
286. Britannia Brown Bread
287. Britannia Multigrain Bread
288. Britannia Sandwich Bread
289. Britannia Pav
290. Britannia Burger Bun
291. Britannia Pizza Base
292. Britannia Fruit Bread
293. Britannia Cheese Slices
294. Britannia The Laughing Cow Cheese Spread
295. Britannia Cheese Cubes
296. Britannia Processed Cheese Block
297. Britannia Mozzarella Cheese
298. Britannia Pizza Cheese
299. Britannia Winkin' Cow Thick Shake Chocolate
300. Britannia Winkin' Cow Thick Shake Vanilla
301. Britannia Winkin' Cow Thick Shake Strawberry
302. Britannia Winkin' Cow Thick Shake Mango
303. Britannia Winkin' Cow Milkshake Chocolate
304. Britannia Winkin' Cow Milkshake Vanilla
305. Britannia Winkin' Cow Milkshake Strawberry
306. Britannia Winkin' Cow Milkshake Mango
307. Britannia Winkin' Cow Lassi
308. Britannia Winkin' Cow Buttermilk
309. Britannia NutriChoice Oats Cookies
310. Britannia NutriChoice Ragi Cookies
311. Britannia NutriChoice Multigrain Cookies
312. Britannia Good Day Cashew Almond Cookies
313. Britannia Good Day Pista Almond Cookies
314. Britannia Good Day Choco Almond Cookies
315. Britannia Good Day Rich Butter Cookies
316. Britannia Good Day Fruit & Nut Cookies
317. Britannia Bourbon Vanilla Cream Biscuits
318. Britannia Bourbon Chocolate Cream Biscuits
319. Britannia Treat Choco Cream Biscuits
320. Britannia Treat Strawberry Cream Biscuits
321. Britannia Treat Orange Cream Biscuits
322. Britannia Marie Gold Cashew
323. Britannia Marie Gold Elaichi
324. Britannia NutriChoice Digestive Oats
325. Britannia NutriChoice Digestive Multigrain
326. Britannia NutriChoice Sugar-Free Biscuits
327. Britannia Pure Magic Choco Layered Cookies
328. Britannia Pure Magic Chocolate Hazelnut Cookies
329. Britannia Little Hearts Classic
330. Britannia Little Hearts Chocolate
331. Britannia 50-50 Maska Chaska Cream
332. Britannia 50-50 Golmaal
333. Britannia Time Pass Cream & Onion
334. Britannia Time Pass Chilli Chatka
335. Britannia Treat Jim Jam Strawberry
336. Britannia Treat Jim Jam Chocolate
337. Britannia Cake Gobbles Choco Lava
338. Britannia Gobbles Choco Swiss Roll
339. Britannia Gobbles Vanilla Swiss Roll
340. Britannia Gobbles Fruit Cake
341. Britannia Gobbles Chocolate Muffins
342. Britannia Gobbles Vanilla Muffins
343. Britannia Gobbles Choco Muffins
344. Britannia Gobbles Plum Cake
345. Britannia Gobbles Brownie Chocolate
346. Britannia Cheese Garlic Bread
347. Britannia Cheese Garlic Toast
348. Britannia Milk Rusk
349. Britannia Elaichi Rusk
350. Britannia Jeera Rusk

Parle Products

351. Parle-G Original Glucose Biscuits
352. Parle-G Gold
353. Parle-G Royale
354. Parle-G Milk Shakti
355. Parle Monaco Classic Salted Biscuits
356. Parle Monaco Cheeslings
357. Parle Monaco Piri Piri
358. Parle KrackJack
359. Parle Hide & Seek Chocolate Chip Cookies
360. Parle Hide & Seek Black Bourbon
361. Parle Hide & Seek Milano
362. Parle Hide & Seek Fab
363. Parle Hide & Seek Choco Rolls
364. Parle Hide & Seek Choco Fills
365. Parle Hide & Seek Chocolate Creme
366. Parle Hide & Seek Vanilla Creme
367. Parle 20-20 Butter Cookies
368. Parle 20-20 Cashew Cookies
369. Parle 20-20 Golden Arcs
370. Parle 20-20 Nice
371. Parle 20-20 Choco Chip Cookies
372. Parle Milano Centre Filled Cookies
373. Parle Melody Chocolaty Toffee
374. Parle Kismi Toffee
375. Parle Kismi Elaichi Toffee
376. Parle Mango Bite
377. Parle Orange Bite
378. Parle Kaccha Mango Bite
379. Parle Poppins
380. Parle Mazelo
381. Parle Mazelo Mango
382. Parle Mazelo Orange
383. Parle Mazelo Strawberry
384. Parle Mazelo Pineapple
385. Parle Melody Chocolaty Eclairs
386. Parle Kaccha Mango Candy
387. Parle Mango Bite Candy
388. Parle Rola Cola
389. Parle Frooti
390. Parle Frooti Mango Drink
391. Parle Frooti Mango Drink PET Bottle
392. Parle Frooti Mango Drink Tetra Pack
393. Parle Frooti Mango Drink Family Pack
394. Parle Appy
395. Parle Appy Fizz
396. Parle Appy Fizz Apple Drink
397. Parle Appy Fizz PET Bottle
398. Parle Monaco Zeera
399. Parle Monaco Classic
400. Parle KrackJack Sweet & Salty
401. Parle Marie Choice
402. Parle Marie Choice Active
403. Parle Fab Bourbon
404. Parle Fab Strawberry Cream Biscuits
405. Parle Fab Orange Cream Biscuits
406. Parle Fab Vanilla Cream Biscuits
407. Parle Fab Chocolate Cream Biscuits
408. Parle Magix Cream Biscuits
409. Parle Magix Orange Cream
410. Parle Magix Chocolate Cream
411. Parle Magix Elaichi Cream
412. Parle Milano Choco Chip Cookies
413. Parle Milano Orange Cookies
414. Parle Milano Choco Nut Cookies
415. Parle Top Biscuits
416. Parle Top Orange Cream Biscuits
417. Parle Top Chocolate Cream Biscuits
418. Parle Top Vanilla Cream Biscuits
419. Parle Nimkin
420. Parle Namkeen
421. Parle Full Toss
422. Parle Full Toss Masala
423. Parle Full Toss Cheese
424. Parle Full Toss Tomato
425. Parle Aloo Chaat
426. Parle Mexitos
427. Parle Mexitos Nacho Chips
428. Parle Mexitos Cheese Nachos
429. Parle Mexitos Masala Nachos
430. Parle Wafers Salted
431. Parle Wafers Masala
432. Parle Wafers Cream & Onion
433. Parle Wafers Tomato
434. Parle KrackJack Cream Biscuits
435. Parle Happy Happy Choco-Chip Cookies
436. Parle Happy Happy Choco-Chip Cream Biscuits
437. Parle Happy Happy Vanilla Cookies
438. Parle Happy Happy Chocolate Cookies
439. Parle Happy Happy Choco Rolls
440. Parle Happy Happy Choco Fills
441. Parle G Original Family Pack
442. Parle-G Gold Family Pack
443. Parle Monaco Family Pack
444. Parle KrackJack Family Pack
445. Parle Hide & Seek Family Pack
446. Parle 20-20 Family Pack
447. Parle Marie Choice Family Pack
448. Parle Kismi Chocolate Toffee
449. Parle Melody Chocolate Toffee Family Pack
450. Parle Poppins Candy Family Pack

Parle Agro Products

451. Frooti Mango Drink
452. Appy Apple Juice
453. Appy Fizz Apple Drink
454. Smoodh Chocolate Milkshake
455. Smoodh Toffee Caramel Milkshake
456. Smoodh Mango Milkshake
457. Smoodh Strawberry Milkshake
458. Smoodh Chocolate Hazelnut Milkshake
459. Smoodh Kesar Badam Milkshake
460. Smoodh Vanilla Milkshake
461. Bailley Packaged Drinking Water
462. Bailley Soda
463. Bailley Club Soda
464. Bailley Sparkling Water
465. Hippo Chips
466. Hippo Tomato Discs
467. Hippo Yoghurt Discs
468. Hippo Chinese Manchurian Discs
469. Hippo Chatpatta Discs
470. Hippo Chilli Chatka Discs
471. Hippo Cheese Discs
472. Hippo Peri Peri Discs
473. Dhishoom
474. Dhishoom Masala Drink
475. Dhishoom Mango Drink
476. Dhishoom Apple Drink
477. Dhishoom Orange Drink
478. Grappo Fizz
479. Grappo Fizz Grape Drink
480. Saint Juice
481. Saint Fruit Juice
482. Saint Mixed Fruit Juice
483. Saint Orange Juice
484. Saint Mango Juice
485. Saint Apple Juice
486. Saint Guava Juice
487. Saint Litchi Juice
488. Saint Pomegranate Juice
489. Saint Pineapple Juice
490. Saint Coconut Water
491. Saint Fruit Nectar
492. Frooti Mango Drink Tetra Pack
493. Frooti Mango Drink PET Bottle
494. Frooti Mango Drink Family Pack
495. Appy Apple Juice Tetra Pack
496. Appy Apple Juice PET Bottle
497. Appy Fizz Apple Drink PET Bottle
498. Appy Fizz Apple Drink Can
499. Smoodh Chocolate Milkshake Tetra Pack
500. Smoodh Toffee Caramel Milkshake Tetra Pack

501. Hocco Vanilla Ice Cream
502. Hocco Chocolate Ice Cream
503. Hocco Strawberry Ice Cream
504. Hocco Butterscotch Ice Cream
505. Hocco Kesar Pista Ice Cream
506. Hocco Mango Ice Cream
507. Hocco Rajbhog Ice Cream
508. Hocco American Dry Fruit Ice Cream
509. Hocco Cookies and Cream Ice Cream
510. Hocco Chocolate Chip Ice Cream
511. Hocco Black Currant Ice Cream
512. Hocco Kaju Draksh Ice Cream
513. Hocco Chocolate Fudge Ice Cream
514. Hocco Belgian Chocolate Ice Cream
515. Hocco Roasted Almond Ice Cream
516. Hocco Pista Ice Cream
517. Hocco Malai Kulfi
518. Hocco Kesar Kulfi
519. Hocco Mango Bar
520. Hocco Chocolate Bar
521. Hocco Orange Bar
522. Hocco Chocolate Cone
523. Hocco Vanilla Cone

524. Lay's India's Magic Masala
525. Lay's Classic Salted
526. Lay's American Style Cream & Onion
527. Lay's Spanish Tomato Tango
528. Lay's India's Tangy Treat
529. Lay's Chile Limon
530. Lay's West Indies Hot 'n' Sweet Chilli
531. Lay's Maxx Macho Chilli
532. Lay's Maxx Sizzling Barbecue
533. Lay's Maxx Pepper
534. Lay's Stax
535. Kurkure Masala Munch
536. Kurkure Solid Masti Masala
537. Kurkure Green Chutney Rajasthani Style
538. Kurkure Chilli Chatka
539. Kurkure Naughty Tomato
540. Kurkure Puffcorn Yummy Cheese
541. Kurkure Puffcorn Fiery Chilli
542. Kurkure Playz
543. Doritos Sweet Chilli
544. Doritos Cheese Nachos
545. Uncle Chipps Spicy Treat
546. Uncle Chipps Plain Salted
547. Cheetos
548. Quaker Oats
549. Quaker Oats Plus
550. Quaker Multigrain Oats
551. Pepsi
552. Pepsi Black
553. Mountain Dew
554. Sting Energy Drink
555. 7UP
556. Mirinda
557. Slice
558. Tropicana fruit beverages
559. Nimbooz
560. Aquafina Packaged Drinking Water

561. Coca-Cola Original
562. Coca-Cola Zero Sugar
563. Diet Coke
564. Thums Up
565. Charged by Thums Up
566. Sprite
567. Fanta Orange
568. Fanta Apple Delite
569. Limca
570. Maaza Original Mango
571. Maaza Aam Panna
572. Kinley Packaged Drinking Water
573. Kinley Soda
574. Minute Maid Pulpy Orange
575. Minute Maid Mixed Fruit
576. Rimzim
577. Schweppes Bitter Lemon
578. Schweppes Mint Mojito
579. Georgia Coffee

580. Cadbury Dairy Milk
581. Cadbury Dairy Milk Silk
582. Cadbury Dairy Milk Silk Oreo
583. Cadbury Dairy Milk Silk Roast Almond
584. Cadbury Dairy Milk Silk Fruit & Nut
585. Cadbury Dairy Milk Silk Mousse
586. Cadbury Dairy Milk Silk Bubbly
587. Cadbury Dairy Milk Crackle
588. Cadbury Dairy Milk Fruit & Nut
589. Cadbury Dairy Milk Roast Almond
590. Cadbury Dairy Milk Shots
591. Cadbury 5 Star
592. Cadbury Perk
593. Cadbury Gems
594. Cadbury Eclairs
595. Cadbury Celebrations Assorted Chocolate Gift Pack
596. Cadbury Celebrations Rich Dry Fruit Collection
597. Cadbury Bournvita
598. Cadbury Bournvita 5 Star Magic
599. Cadbury Bournvita Zero Added Sugar
600. Oreo Original
601. Oreo Chocolate Cream
602. Oreo Strawberry Cream
603. Oreo Vanilla Cream
604. Cadbury Chocobakes
605. Cadbury Chocobakes Choc Layered Cakes
606. Tang Orange Drink Mix
607. Tang Mango Drink Mix
608. Lotus Biscoff Biscuits
609. Lotus Biscoff Spread

610. Balaji Wafers Simply Salted
611. Balaji Wafers Masala Masti
612. Balaji Wafers Chat Chaska
613. Balaji Wafers Cream & Onion
614. Balaji Wafers Tomato Twist
615. Balaji Wafers Chilli Lemon
616. Balaji Wafers Farali Chiwda
617. Balaji Ratlami Sev
618. Balaji Tikha Mitha Mix
619. Balaji Punjabi Tadka
620. Balaji Aloo Sev
621. Balaji Long Sev
622. Balaji Bhujia Sev
623. Balaji Nylon Sev
624. Balaji Chana Dal
625. Balaji Moong Dal
626. Balaji Masala Sing
627. Balaji Salted Peanuts
628. Balaji Khatta Mitha Mix
629. Balaji Navratan Mix
630. Balaji Corn Rings
631. Balaji Masala Rings
632. Balaji Simply Salted Potato Chips
633. Balaji Tomato Ketchup

634. Haldiram's Aloo Bhujia
635. Haldiram's Bhujia Sev
636. Haldiram's Plain Bhujia
637. Haldiram's Khatta Meetha
638. Haldiram's Navrattan Mix
639. Haldiram's Moong Dal
640. Haldiram's Chana Dal
641. Haldiram's Masala Chana
642. Haldiram's Salted Peanuts
643. Haldiram's Masala Peanuts
644. Haldiram's Punjabi Tadka
645. Haldiram's Tasty Nuts
646. Haldiram's All in One
647. Haldiram's Bikaneri Bhujia
648. Haldiram's Nagpur Orange Burfi
649. Haldiram's Soan Papdi
650. Haldiram's Kaju Katli
651. Haldiram's Motichoor Laddu
652. Haldiram's Besan Laddu
653. Haldiram's Gulab Jamun
654. Haldiram's Rasgulla
655. Haldiram's Bhakarwadi
656. Haldiram's Samosa
657. Haldiram's Mini Samosa
658. Haldiram's Kachori
659. Haldiram's Punjabi Samosa
660. Haldiram's Frozen Paratha
661. Haldiram's Frozen Aloo Tikki
662. Haldiram's Frozen Chole Bhature
663. Haldiram's Frozen Paneer Tikka
664. Haldiram's Papad
665. Haldiram's Masala Papad
666. Haldiram's Plain Khakhra
667. Haldiram's Masala Khakhra

668. Gits Instant Idli Mix
669. Gits Instant Dosa Mix
670. Gits Instant Rava Dosa Mix
671. Gits Instant Uttapam Mix
672. Gits Instant Khaman Dhokla Mix
673. Gits Instant Nylon Khaman Mix
674. Gits Instant Handvo Mix
675. Gits Instant Gulab Jamun Mix
676. Gits Instant Rasmalai Mix
677. Gits Instant Jalebi Mix
678. Gits Instant Rice Idli Mix
679. Gits Instant Medu Vada Mix
680. Gits Ready Meals Dal Makhani
681. Gits Ready Meals Punjabi Chole
682. Gits Ready Meals Rajma Masala
683. Gits Ready Meals Palak Paneer
684. Gits Ready Meals Paneer Butter Masala
685. Gits Ready Meals Vegetable Pulao
686. Gits Ready Meals Dal Fry
687. Gits Ready Meals Pav Bhaji
688. Gits Ready Meals Vegetable Biryani
689. Gits Ready Meals Aloo Mutter
690. Gits Ready Meals Sarson Ka Saag
691. Gits Ready-to-Eat Khaman Dhokla
692. Gits Ready-to-Eat Idli
693. Gits Ready-to-Eat Upma
694. Gits Ready-to-Eat Poha

695. ITC Aashirvaad Whole Wheat Atta
696. ITC Aashirvaad Select Atta
697. ITC Aashirvaad Multigrain Atta
698. ITC Aashirvaad Shudh Chakki Atta
699. ITC Aashirvaad Nature's Super Foods Ragi Flour
700. ITC Aashirvaad Nature's Super Foods Multigrain Flour
701. ITC Sunfeast Dark Fantasy Choco Fills
702. ITC Sunfeast Dark Fantasy Choco Meltz
703. ITC Sunfeast Dark Fantasy Bourbon
704. ITC Sunfeast Mom's Magic Rich Cashew
705. ITC Sunfeast Mom's Magic Butter Cookies
706. ITC Sunfeast Marie Light
707. ITC Sunfeast Farmlite Digestive All Good
708. ITC Sunfeast Farmlite Oats & Almonds
709. ITC Sunfeast Glucose Biscuits
710. ITC Sunfeast Bounce
711. ITC Sunfeast Dream Cream
712. ITC Sunfeast Nice
713. ITC Sunfeast Benne Vita
714. ITC Bingo! Mad Angles Achaari Masti
715. ITC Bingo! Mad Angles Tomato Madness
716. ITC Bingo! Mad Angles Masti Masala
717. ITC Bingo! Original Style Chilli Sprinkled
718. ITC Bingo! Original Style Salt Sprinkled
719. ITC Bingo! Tedhe Medhe Masala Tadka
720. ITC Bingo! Tedhe Medhe Chatpata Twist
721. ITC Bingo! Potato Chips
722. ITC Bingo! No Rulz
723. ITC YiPPee! Magic Masala Noodles
724. ITC YiPPee! Classic Masala Noodles
725. ITC YiPPee! Mood Masala Noodles
726. ITC YiPPee! Power Up Noodles
727. ITC Kitchens of India Dal Bukhara
728. ITC Kitchens of India Paneer Makhani
729. ITC Kitchens of India Punjabi Chole
730. ITC Kitchens of India Chicken Biryani
731. ITC Kitchens of India Vegetable Biryani
732. ITC Master Chef Frozen French Fries
733. ITC Master Chef Frozen Green Peas
734. ITC Master Chef Frozen Sweet Corn
735. ITC Master Chef Frozen Potato Wedges
736. ITC Master Chef Frozen Veggie Fingers
737. ITC Classmate Sunfeast Yippee Pasta
738. ITC B Natural Mixed Fruit Beverage
739. ITC B Natural Orange Beverage
740. ITC B Natural Mango Beverage
741. ITC Fabelle Chocolate
742. ITC Candyman Toffichoo
743. ITC Candyman Eclairs
744. ITC Candyman Fruitee Fun

745. Kissan Fresh Tomato Ketchup
746. Kissan Sweet & Spicy Tomato Ketchup
747. Kissan No Onion No Garlic Tomato Ketchup
748. Kissan Mixed Fruit Jam
749. Kissan Pineapple Jam
750. Kissan Mango Jam
751. Kissan Strawberry Jam
752. Kissan Orange Marmalade
753. Kissan Mixed Fruit Squash
754. Kissan Mango Squash
755. Kissan Orange Squash
756. Kissan Mixed Fruit Drink
757. Kissan Tomato Sauce

758. Nestlé Maggi 2-Minute Masala Noodles
759. Nestlé Maggi 2-Minute Special Masala Noodles
760. Nestlé Maggi 2-Minute Atta Noodles
761. Nestlé Maggi 2-Minute No Onion No Garlic Noodles
762. Nestlé Maggi Cuppa Noodles Masala
763. Nestlé Maggi Cuppa Noodles Chilli Chow
764. Nestlé Maggi Pazzta Cheese Macaroni
765. Nestlé Maggi Pazzta Tomato Twist
766. Nestlé Maggi Hot & Sweet Tomato Chilli Sauce
767. Nestlé Maggi Rich Tomato Ketchup
768. Nestlé Maggi Coconut Milk Powder
769. Nestlé Nescafé Classic Coffee
770. Nestlé Nescafé Sunrise Instant Coffee
771. Nestlé Nescafé Gold
772. Nestlé Nescafé Gold Blend
773. Nestlé Nescafé RTD Coffee, where available
774. Nestlé Milkmaid Sweetened Condensed Milk
775. Nestlé Everyday Dairy Whitener
776. Nestlé Everyday Shahi Ghee, where available
777. Nestlé a+ Nourish Milk
778. Nestlé a+ Slim Milk
779. Nestlé a+ Curd
780. Nestlé a+ Pro-Grow Yogurt
781. Nestlé KitKat
782. Nestlé KitKat Dessert Delight
783. Nestlé Munch
784. Nestlé Milkybar
785. Nestlé Milkybar Moosha
786. Nestlé Bar-One
787. Nestlé Polo Original
788. Nestlé Polo Mint O
789. Nestlé Éclairs
790. Nestlé Alpino
791. Nestlé Milk Chocolate
792. Nestlé Nesquik, where available
793. Nestlé Ceregrow
794. Nestlé Cerelac Rice
795. Nestlé Cerelac Wheat
796. Nestlé Cerelac Multigrain
797. Nestlé Lactogen Infant Formula
798. Nestlé NAN PRO Infant Formula
799. Nestlé NAN EXCELLAPRO Infant Formula
800. Nestlé Resource High Protein, where available

801. Unibic Choco Chip Cookies
802. Unibic Chocolate Cookies
803. Unibic Cashew Cookies
804. Unibic Butter Cookies
805. Unibic Fruit and Nut Cookies
806. Unibic Anzac Cookies
807. Unibic Oatmeal Cookies
808. Unibic Sugar-Free Oatmeal Cookies
809. Unibic Digestive Cookies
810. Unibic Multigrain Cookies
811. Unibic Almond Cookies
812. Unibic Coconut Cookies
813. Unibic Orange Cookies
814. Unibic Vanilla Cookies
815. Unibic Snappers Chocolate Chip Cookies
816. Unibic Snappers Choco Nut Cookies
817. Unibic Pista Cookies
818. Unibic Cashew Badam Cookies
819. Unibic Assorted Cookies

820. Campa Cola
821. Campa Orange
822. Campa Lemon
823. Campa Clear Lime
824. Campa Cola Zero Sugar
825. Campa Energy Drink

826. Mapro Strawberry Crush
827. Mapro Raspberry Crush
828. Mapro Mango Crush
829. Mapro Pineapple Crush
830. Mapro Blueberry Crush
831. Mapro Mixed Fruit Crush
832. Mapro Rose Sharbat
833. Mapro Khus Sharbat
834. Mapro Kesar Sharbat
835. Mapro Lemon Ginger Sharbat
836. Mapro Strawberry Syrup
837. Mapro Chocolate Syrup
838. Mapro Mango Syrup
839. Mapro Falero Strawberry
840. Mapro Falero Mango
841. Mapro Falero Raspberry
842. Mapro Fruit Jelly
843. Mapro Mixed Fruit Jam
844. Mapro Strawberry Jam
845. Mapro Pineapple Jam
846. Mapro Mango Jam
847. Mapro Mixed Fruit Preserve
848. Mapro Strawberry Topping
849. Mapro Blueberry Topping
850. Mapro Chocolate Sauce

851. McCain French Fries
852. McCain Smiles
853. McCain Aloo Tikki
854. McCain Veggie Fingers
855. McCain Chilli Garlic Potato Bites
856. McCain Potato Cheese Shots
857. McCain Potato Cheese Nuggets
858. McCain Potato Wedges
859. McCain Masala Fries
860. McCain French Fries Peri Peri
861. McCain Super Wedges
862. McCain Veggie Nuggets
863. McCain Crispy Potato Rounds
864. McCain Aloo Patty
865. McCain Mini Samosa
866. McCain Punjabi Samosa
867. McCain Cheese Corn Triangles
868. McCain Chilli Cheese Nuggets
869. McCain Pizza Fingers
870. McCain Hash Browns

871. Knorr Classic Thick Tomato Soup
872. Knorr Sweet Corn Vegetable Soup
873. Knorr Sweet Corn Chicken Soup
874. Knorr Hot and Sour Vegetable Soup
875. Knorr Hot and Sour Chicken Soup
876. Knorr Manchow Vegetable Soup
877. Knorr Manchow Chicken Soup
878. Knorr Mixed Vegetable Soup
879. Knorr Cream of Mushroom Soup
880. Knorr Tomato Chatpata Soup
881. Knorr Soupy Noodles
882. Knorr Chinese Manchow Soup
883. Knorr Mexican Tomato Soup
884. Knorr Instant Soup Mix
885. Knorr Professional Soup Mix

886. Kellogg's Corn Flakes Original
887. Kellogg's Corn Flakes Real Almond and Honey
888. Kellogg's Chocos
889. Kellogg's Chocos Duet
890. Kellogg's Froot Loops
891. Kellogg's Honey Loops
892. Kellogg's Special K
893. Kellogg's Muesli Fruit, Nut and Seeds
894. Kellogg's Muesli with 21% Fruits, Nuts and Seeds
895. Kellogg's Granola
896. Kellogg's Oats
897. Kellogg's Multigrain Chocos
898. Kellogg's Extra Muesli
899. Kellogg's All-Bran, where available
900. Kellogg's Crunchy Nut, where available

901. Chitale Bandhu Bakarwadi
902. Chitale Bandhu Mini Bakarwadi
903. Chitale Bandhu Amba Barfi
904. Chitale Bandhu Kaju Katli
905. Chitale Bandhu Besan Ladoo
906. Chitale Bandhu Motichoor Ladoo
907. Chitale Bandhu Shrikhand
908. Chitale Bandhu Amrakhand
909. Chitale Bandhu Mango Shrikhand
910. Chitale Bandhu Peda
911. Chitale Bandhu Kandi Pedha
912. Chitale Bandhu Malai Barfi
913. Chitale Bandhu Kaju Roll
914. Chitale Bandhu Anjeer Barfi
915. Chitale Bandhu Dry Fruit Barfi
916. Chitale Bandhu Gulab Jamun
917. Chitale Bandhu Rasgulla
918. Chitale Bandhu Milk Cake
919. Chitale Bandhu Chivda
920. Chitale Bandhu Poha Chivda
921. Chitale Bandhu Bhadang
922. Chitale Bandhu Chakli
923. Chitale Bandhu Bhakarwadi
924. Chitale Bandhu Namkeen
925. Chitale Bandhu Farsan
926. Chitale Bandhu Shev
927. Chitale Bandhu Lasun Shev
928. Chitale Bandhu Tikhat Shev
929. Chitale Bandhu Nylon Papdi
930. Chitale Bandhu Toast

931. Ching's Secret Schezwan Chutney
932. Ching's Secret Schezwan Sauce
933. Ching's Secret Red Chilli Sauce
934. Ching's Secret Green Chilli Sauce
935. Ching's Secret Dark Soy Sauce
936. Ching's Secret Light Soy Sauce
937. Ching's Secret Hot Garlic Sauce
938. Ching's Secret Tomato Ketchup
939. Ching's Secret Veg Hakka Noodles
940. Ching's Secret Egg Hakka Noodles
941. Ching's Secret Singapore Curry Noodles
942. Ching's Secret Manchurian Noodles
943. Ching's Secret Chowmein Noodles
944. Ching's Secret Instant Noodles Schezwan
945. Ching's Secret Instant Noodles Hot Garlic
946. Ching's Secret Instant Noodles Manchurian
947. Ching's Secret Instant Soup Manchow
948. Ching's Secret Instant Soup Hot and Sour
949. Ching's Secret Instant Soup Sweet Corn
950. Ching's Secret Instant Soup Tomato
951. Ching's Secret Veg Manchurian Mix
952. Ching's Secret Fried Rice Masala
953. Ching's Secret Chilli Chicken Masala
954. Ching's Secret Paneer Chilli Masala
955. Ching's Secret Schezwan Fried Rice Masala

956. Bikaji Bhujia
957. Bikaji Bikaneri Bhujia
958. Bikaji Aloo Bhujia
959. Bikaji Navratan Mix
960. Bikaji Khatta Meetha
961. Bikaji All in One
962. Bikaji Moong Dal
963. Bikaji Chana Dal
964. Bikaji Masala Peanuts
965. Bikaji Salted Peanuts
966. Bikaji Punjabi Tadka
967. Bikaji Tasty Nuts
968. Bikaji Bikaneri Mixture
969. Bikaji Bombay Mix
970. Bikaji Kaju Mixture
971. Bikaji Ratlami Sev
972. Bikaji Aloo Lachha
973. Bikaji Masala Boondi
974. Bikaji Plain Boondi
975. Bikaji Chana Jor Garam
976. Bikaji Papad
977. Bikaji Masala Papad
978. Bikaji Soan Papdi
979. Bikaji Rasgulla
980. Bikaji Gulab Jamun
981. Bikaji Kaju Katli
982. Bikaji Besan Laddu
983. Bikaji Motichoor Laddu
984. Bikaji Mini Samosa
985. Bikaji Punjabi Samosa
986. Bikaji Kachori
987. Bikaji Bhakarwadi
988. Bikaji Chakli
989. Bikaji Mathri
990. Bikaji Masala Mathri

991. MTR Ready-to-Eat Dal Makhani
992. MTR Ready-to-Eat Paneer Butter Masala
993. MTR Ready-to-Eat Palak Paneer
994. MTR Ready-to-Eat Rajma Masala
995. MTR Ready-to-Eat Punjabi Chole
996. MTR Ready-to-Eat Vegetable Pulao
997. MTR Ready-to-Eat Bisibele Bath
998. MTR Ready-to-Eat Pongal
999. MTR Ready-to-Eat Lemon Rice
1000. MTR Ready-to-Eat Tamarind Rice
1001. MTR Ready-to-Eat Vegetable Biryani
1002. MTR Ready-to-Eat Sambar Rice
1003. MTR Ready-to-Eat Dal Fry
1004. MTR Ready-to-Eat Aloo Mutter
1005. MTR Ready-to-Eat Mixed Vegetable Curry
1006. MTR Rava Idli Mix
1007. MTR Rice Idli Mix
1008. MTR Dosa Mix
1009. MTR Rava Dosa Mix
1010. MTR Masala Dosa Mix
1011. MTR Uttapam Mix
1012. MTR Instant Upma Mix
1013. MTR Poha Mix
1014. MTR Khaman Dhokla Mix
1015. MTR Vada Mix
1016. MTR Gulab Jamun Mix
1017. MTR Rava Kesari Mix
1018. MTR Badam Drink Mix
1019. MTR Thandai Mix
1020. MTR Rose Milk Mix
1021. MTR Filter Coffee
1022. MTR Instant Coffee
1023. MTR Sambar Powder
1024. MTR Rasam Powder
1025. MTR Chutney Powder
1026. MTR Bisibele Bath Powder
1027. MTR Puliyogare Powder
1028. MTR Garam Masala
1029. MTR Chana Masala
1030. MTR Paneer Butter Masala Mix
1031. MTR Butter Milk Mix
1032. MTR Badam Feast Drink Mix
1033. MTR Vermicelli
1034. MTR Roasted Vermicelli
1035. MTR Masala Oats
1036. MTR Minute Fresh Breakfast Mix

1037. Campa Cola
1038. Campa Cola Zero Sugar
1039. Campa Orange
1040. Campa Lemon
1041. Campa Clear Lime
1042. Campa Energy Drink
1043. Campa Cola 200 ml
1044. Campa Cola 500 ml
1045. Campa Cola 750 ml
1046. Campa Cola 1.25 L
1047. Campa Cola 2 L
1048. Campa Orange 200 ml
1049. Campa Orange 500 ml
1050. Campa Lemon 200 ml
1051. Campa Lemon 500 ml

1052. Raw Pressery Cold-Pressed Orange Juice
1053. Raw Pressery Cold-Pressed Valencia Orange Juice
1054. Raw Pressery Cold-Pressed Pomegranate Juice
1055. Raw Pressery Cold-Pressed Mixed Fruit Juice
1056. Raw Pressery Cold-Pressed Apple Juice
1057. Raw Pressery Cold-Pressed Pineapple Juice
1058. Raw Pressery Cold-Pressed Watermelon Juice
1059. Raw Pressery Cold-Pressed Mango Juice
1060. Raw Pressery Cold-Pressed Coconut Water
1061. Raw Pressery Coconut Water with Pulp
1062. Raw Pressery Almond Milk
1063. Raw Pressery Chocolate Almond Milk
1064. Raw Pressery Turmeric Milk
1065. Raw Pressery Cold Coffee
1066. Raw Pressery Chocolate Milkshake
1067. Raw Pressery Mango Milkshake
1068. Raw Pressery Mixed Berry Juice
1069. Raw Pressery Lemonade
1070. Raw Pressery Pink Guava Juice

1071. Hershey's Milk Chocolate Bar
1072. Hershey's Kisses Milk Chocolate
1073. Hershey's Kisses Cookies 'n' Creme
1074. Hershey's Kisses Almond
1075. Hershey's Exotic Dark Chocolate
1076. Hershey's Special Dark Chocolate
1077. Hershey's Chocolate Chips
1078. Hershey's Cocoa Powder
1079. Hershey's Chocolate Syrup
1080. Hershey's Strawberry Syrup
1081. Hershey's Caramel Syrup
1082. Hershey's Milkshake Syrup
1083. Hershey's Chocolate Spread
1084. Hershey's Cocoa Powder Natural Unsweetened
1085. Hershey's Instant Chocolate Drink Mix
1086. Hershey's Milkshake Mix Chocolate
1087. Hershey's Milkshake Mix Strawberry
1088. Hershey's Milkshake Mix Vanilla
1089. Hershey's Cookies 'n' Creme Bar
1090. Hershey's Almonds Chocolate Bar
1091. Hershey's Nuggets Milk Chocolate
1092. Hershey's Nuggets Special Dark
1093. Hershey's Nuggets Extra Creamy Milk Chocolate
1094. Hershey's Miniatures Assorted Chocolates
1095. Hershey's Reese's Peanut Butter Cups
1096. Hershey's Reese's Pieces
1097. Hershey's Jolly Rancher Candy
1098. Hershey's Milk Chocolate with Almonds
1099. Hershey's Kisses Deluxe
1100. Hershey's Syrup Strawberry Flavour

1101. Too Yumm! Karare
1102. Too Yumm! Karare Chilli Achari
1103. Too Yumm! Karare Chatpata
1104. Too Yumm! Karare Masala
1105. Too Yumm! Multigrain Chips
1106. Too Yumm! Multigrain Chips Indian Masala
1107. Too Yumm! Multigrain Chips Tomato
1108. Too Yumm! Multigrain Chips Chilli
1109. Too Yumm! Veggie Stix
1110. Too Yumm! Veggie Stix Masala
1111. Too Yumm! Veggie Stix Tomato
1112. Too Yumm! Foxnuts Peri Peri
1113. Too Yumm! Foxnuts Himalayan Salt
1114. Too Yumm! Foxnuts Cheese
1115. Too Yumm! Foxnuts Pudina
1116. Too Yumm! Foxnuts Cream and Onion
1117. Too Yumm! Karare Puffcorn
1118. Too Yumm! Karare Rings
1119. Too Yumm! Karare Wheels
1120. Too Yumm! Potato Chips
1121. Too Yumm! Potato Chips Classic Salted
1122. Too Yumm! Potato Chips Masala
1123. Too Yumm! Potato Chips Cream and Onion
1124. Too Yumm! Banana Chips
1125. Too Yumm! Roasted Makhana
1126. Too Yumm! Roasted Chana
1127. Too Yumm! Peanut Snacks
1128. Too Yumm! Multigrain Namkeen
1129. Too Yumm! Protein Chips
1130. Too Yumm! Veggie Puffs
"""

pattern = re.compile(r"^(\d+)\.\s*(.+)$", re.MULTILINE)
matches = pattern.findall(raw_text)
print(f"Total parsed items: {len(matches)}")
print("First item:", matches[0])
print("Last item:", matches[-1])

# Save raw parsed list
import json
with open("data/raw_sku_list.json", "w", encoding="utf-8") as f:
    json.dump([{"number": int(m[0]), "name": m[1].strip()} for m in matches], f, indent=2)
print("Saved data/raw_sku_list.json")
