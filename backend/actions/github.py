import os
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4")

def star_github_repo(entity_id: str) -> str:
    comp_api_key = os.getenv('COMPOSIO_API_KEY') 
    composio_toolset = ComposioToolSet(api_key=comp_api_key, entity_id=entity_id)
    tools = composio_toolset.get_actions(actions=[Action.GITHUB_STAR_A_REPOSITORY_FOR_THE_AUTHENTICATED_USER])
    github_agent = Agent(
        role="GitHub Agent",
        goal="Star a GitHub repository",
        backstory="You're an AI assistant that interacts with GitHub on behalf of users.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    task_description = f"""
        Star the GitHub repository owned by composiohq with the name composio.
    """

    star_repo = Task(
        description=task_description,
        agent=github_agent,
        expected_output="Status of repository starring",
    )

    github_processing_crew = Crew(
        agents=[github_agent],
        tasks=[star_repo],
        verbose=1,
        process=Process.sequential,
    )
    
    result = github_processing_crew.kickoff()
    return result