Dislaimer: This is a hobby side project used as a playground to test out stuff in an agentic environment. Everything generated is done by large language models which are bound to make mistakes. When you generate your meal plan, thoroughly check the recipes for any intollerances and allergies you might have.

# Fresh meal planner
Welcome to the Meal Planner AI GitHub repository! This project utilizes agentic AI with long-term memory capabilities to generate a personalized meal plan tailored to individual user preferences and dislikes. By continually learning and adapting based on user feedback, the AI aims to provide an ever-improving, customized meal planning experience.

## Tech
This project is built using [deno](https://deno.com/) [fresh](https://fresh.deno.dev/). It uses [langchain js](https://js.langchain.com/v0.2/docs/introduction/) and [langgraph js](https://langchain-ai.github.io/langgraphjs/). For recipe retrieval [Edamam's recipe search API](https://developer.edamam.com/edamam-docs-recipe-api) is used. For interaction with language models, [airouter](https://airouter.io) is used. For UI components, tailwind and daisyui are used.

## Setup

### Requirements
- [deno](https://docs.deno.com/runtime/fundamentals/installation/)
- [Edamam API Key](https://developer.edamam.com/edamam-docs-recipe-api)
- [airouter API Key](https://airouter.io/docs/quickstart/getting-started)
- (Optional) [langsmith tracing](https://www.langchain.com/langsmith) API Key

```sh
cp .env.template .env
```
And fill the missing api keys

## Running

```sh
deno task start
```

The app will be available under `localhost:8000`.
