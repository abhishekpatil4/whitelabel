import os
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4o")

def create_new_tweet(entity_id: str) -> str:
    comp_api_key = os.getenv('COMPOSIO_API_KEY') 
    composio_toolset = ComposioToolSet(api_key=comp_api_key, entity_id=entity_id)
    tools = composio_toolset.get_actions(actions=[Action.TWITTER_CREATION_OF_A_POST])
    twitter_agent = Agent(
        role="Twitter Agent",
        goal="Create and post tweets on Twitter",
        backstory="You're an AI assistant that crafts and shares tweets on Twitter.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    task_description = f"""
        Post the following message on Twitter:
        Hey! I used @composiohq to create this tweet
    """

    create_tweet = Task(
        description=task_description,
        agent=twitter_agent,
        expected_output="Status of post creation",
    )

    twitter_processing_crew = Crew(
        agents=[twitter_agent],
        tasks=[create_tweet],
        verbose=1,
        process=Process.sequential,
    )
    
    result = twitter_processing_crew.kickoff()
    return result
