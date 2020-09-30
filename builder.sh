node builder.js
rm -rf nexe
mkdir nexe
cp *.js nexe
cp *.json nexe
cp -r interfaces nexe
cd nexe
rm database.sync.json
echo '{}' > database.sync.json
npm i