import os
from composio_crewai import Action, ComposioToolSet
from crewai import Agent, Crew, Task, Process
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

llm = ChatOpenAI(model="gpt-4")

def create_clickup_space(entity_id: str, workspace_id: str) -> str:
    comp_api_key = os.getenv('COMPOSIO_API_KEY') 
    composio_toolset = ComposioToolSet(api_key=comp_api_key, entity_id=entity_id)
    tools = composio_toolset.get_actions(actions=[Action.CLICKUP_CREATE_SPACE])
    clickup_agent = Agent(
        role="ClickUp Agent",
        goal="Create a new space in ClickUp",
        backstory="You're an AI assistant that interacts with ClickUp on behalf of users.",
        verbose=True,
        llm=llm,
        tools=tools,
        allow_delegation=False,
    )

    task_description = f"""
        Create a new space in ClickUp workspace with ID {workspace_id}.
        The space name should be "New_Workspace_Created_by_Composio".
        Set multiple Assignees as false.
    """

    create_space = Task(
        description=task_description,
        agent=clickup_agent,
        expected_output="Status of space creation in ClickUp",
    )

    clickup_processing_crew = Crew(
        agents=[clickup_agent],
        tasks=[create_space],
        verbose=1,
        process=Process.sequential,
    )
    
    result = clickup_processing_crew.kickoff()
    return result