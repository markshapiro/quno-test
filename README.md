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
1. decoupling between screens and steps allows reusing of same screen in multiple steps.
2. it is possible to define branching logic of questionnaire's flow depending on values that were entered in previous steps.
3. even if it is possible to define flexible (and even circular) flows where the progress (steps done/(all steps)) is not clear in advance, it is still sometimes possible to calculate progress.
4. it is easy to add new functionalities (more inputs in screen, more conditions, different field assignment logic)


## Design Decisions

in my implementation, the backend completely manages the questionnaire's logic and stores its state, which is defined in `questionnaire.ts`.

in order to go to next step, go back, reset and get current screen, the frontend needs to call backend.

the backend instantiates questionnaire instance and its inner classes/objects based on config (`sampleQuestionaire.json`).

the frontend asks for currently displayed screen information (title+input) and once user enters/selects value, the frontend passes the value to backend and gets the screen of next step.
