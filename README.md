
## Run Backend

```
cd quno-test-backend
yarn install
npm run dev
```

## Run Frontend

```
cd quno-test-frontend
yarn install
npm run dev
```

frontend will run on `http://localhost:5173/`

## Schema Structure

the schema consists of `screens` and `steps`, screens are dumb components that contain title and an input (radio, text...) to be used to select option, which will be passed to step.

steps define a screen component to be rendered, an `assignPath` which is a property/path inside a state, to be set with the value the user selects/enters via the screen, and `nextSteps`, which defines what steps that will come next if their `condition` is satisfied (if given)

a condition contains left and right valuators, which can be either a reference a value of a field/path in questionnaire's state or a constant scalar value, and an operator(=, !=, <, >).
a condition is satisfied if relation between the 2 valuators is true depending on operator

every time the user chooses/enters value, it will be added (under `assignPath`) to a (global) state of questionnaire.

the `path` value inside a valuator does have access to the whole state and to every field/value that was assigned in previous steps.

the advantages of this approach:
1. decoupling between screens and steps allows reusing of same screen in multiple steps
2. it is possible to define branching logic of questionnaire's flow depending on values that were entered in previous steps.
3. even if it is possible to define flexible (and even circular) flows where the progress (steps done/(all steps)) is not clear in advance, it is still possible sometimes calculate progress
4. it is easy to add new functionalities (more inputs in screen, more conditions, different field assignment logic)
