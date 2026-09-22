SHKOALA LOTTERY — FINAL GITHUB PACKAGE

ЗАГРУЗИТЕ В КОРЕНЬ РЕПОЗИТОРИЯ ВСЁ СОДЕРЖИМОЕ ЭТОЙ ПАПКИ:

index.html
style.css
script.js
.nojekyll
assets/
    picture-manifest.json
    pictures/
        ...все PNG-картинки по папкам
ASSET_PREVIEW.jpg
README_UPLOAD.txt

ВАЖНО:
1. index.html, style.css и script.js должны лежать НА ОДНОМ УРОВНЕ — в корне.
2. Папку assets не переименовывать.
3. В assets/pictures лежат реальные отдельные PNG без слов.
4. Старые SVG и atlas-файлы не нужны.
5. Логика картинок:
   SHKOALA local pack -> Yandex clipart search -> Yandex all pictures.
6. Русские и английские варианты слов прописаны в базе.
7. У каждого учителя состояние игры хранится локально в его браузере:
   несколько учителей могут пользоваться сайтом одновременно и не мешают друг другу.

GitHub Pages:
Settings -> Pages -> Deploy from a branch -> main / root
