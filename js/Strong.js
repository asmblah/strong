define(function () {

    function Strong(types, fn) {
        return function () {
            var args = arguments,
                idx;

            if (args.length !== types.length) {
                throw new Error("Wrong number of arguments");
            }

            function notInstanceOf(constructor, actual) {
                if (constructor === String) {
                    return typeof actual !== "string";
                }
                if (constructor === Number) {
                    return typeof actual !== "number";
                }
            }

            function checkType(expected, actual) {
                var matched = null,
                    typeIdx;

                // Class constructor was specified
                if (expected instanceof Function) {
                    if (notInstanceOf(expected, actual)) {
                        return new Error("Wrong type for argument " + idx);
                    }
                } else {
                    // List of possible types was specified
                    if ({}.toString.call(expected) === "[object Array]") {
                        for (typeIdx = 0 ; typeIdx < expected.length ; ++typeIdx) {
                            matched = checkType(expected[typeIdx], actual);

                            if (!matched) {
                                break;
                            }
                        }

                        if (matched) {
                            throw matched;
                        }
                    } else {
                        if (actual !== expected) {
                            return new Error("Wrong value for argument " + idx);
                        }
                    }
                }
            }

            for (idx = 0 ; idx < args.length ; ++idx) {
                checkType(types[idx], args[idx]);
            }

            return fn.apply(this, args);
        };
    }

    return Strong;
});
