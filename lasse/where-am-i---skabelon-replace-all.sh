for A in $( find -name where-am-i.js ); do
	cp --verbose where-am-i---skabelon.js $A
done
