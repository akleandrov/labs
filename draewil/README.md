# Комментарии
Завернул в простой REST для удобства
Для определения первого и последнего символа по возможности сдвигаю не буквенные символы.
Если просить больше 40 песен, скорее всего не сможет найти песню на "x", поэтому разрешил дубли в плейлисте (противоречий ТЗ нет.)
Так же конечно можно сдвинуть символ и поискать для него, но посчитал что это ломает основной смысл.
В бонусных не увидел смысла так как примерно всё то тоже самое:

* Для наполнения по длительности просто прибавляем время, вместо счетчика
* Для короткого, просто выбираем самую коротку из подходящих.

# Run

docker-compose -f ./deployments/development/docker-compose.yml build
docker-compose -f ./deployments/development/docker-compose.yml up -d

или через npm run dev
можно старт, но через переменную нужно передать URL для получения данных

# RADIO

RADIO is an application to create a linked playlist for a local radio by applying advanced artificial intelligence algorithms. You are hired as a new Node.js  developer to develope and maintain it.

## Node.js Technical Test

We have created a small technical test for you to showcase how you work. Your task will be to create a small Node.js Application that should create a playlist for a local radio and show that information to the user.

### Challenges

* Applicaiton needs to create a linked list of songs, where each new song title begins with the last letter of the previous one
* First song should be selected randomly
* User needs to specify how many songs in a playlist are required

Example of generated playlist:

1. Hand In Glove
2. Electric Barbarella
3. A Day Without Rain
4. Never Is A Promise
...

(Do you see how each new song title matches the last letter of the previous one?)

#### Bonus Points

* Instead of user specifing number of songs, try to create a playlist of a user-specified duration (to fill a particular time slot on the radio).
* Try to create a shortest playlist that links the songs (in terms of total play time)

#### Data

You can find an XML file with few thousand song title and play time at https://raw.githubusercontent.com/DraewilTech/interview-assets/master/RadioLibrary.xml
The song durations are in milliseconds.

### Review

We value quality over feature-completeness. We do take into consideration your experience level. The goal of this code sample is to help us identify what you consider production-ready code.
The aspects of your code we will assess include:

* **Architecture**: how clean is the separation between layers
* **Correctness**: does the application do what was asked?
* **Code quality**: is the code simple, easy to understand, and maintainable, covered with unit tests? Are there any code smells or other red flags? Does object-oriented code follows principles such as the single responsibility principle? Is the coding style consistent with the language's guidelines? Is it consistent throughout the codebase?
* **Technical choices**: do choices of libraries, architecture etc. seem appropriate for the chosen application?

### Aditional Information

We understand that you’ve probably got a full-time job and a personal life so doing the above test could be definitely finished in a couple of hours.

If you have any questions, email us and we can add it to this readme.

Good luck!