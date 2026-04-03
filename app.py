import streamlit as st
import os

# ============================================================
# PAGE CONFIG
# ============================================================
st.set_page_config(
    page_title="FinQuest - Level Up Your Finances",
    page_icon="💰",
    layout="centered",
    initial_sidebar_state="collapsed"
)

# ============================================================
# SVG ICONS (NO EMOJIS)
# ============================================================
def svg_star(size=24, color="#FFD700"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'

def svg_flame(size=24, color="#FF6B35"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 23c-4.97 0-9-3.58-9-8 0-3.07 2.17-5.83 3.68-7.67l.6-.73c.26-.31.72-.33 1-.04l.38.4c1.4 1.52 3.16 3.45 3.64 5.81.38-.79.76-1.45 1.03-1.88l.42-.67c.2-.31.62-.4.92-.17C16.28 11.39 21 14.79 21 15c0 4.42-4.03 8-9 8z"/></svg>'

def svg_lock(size=24, color="#9E9E9E"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg>'

def svg_check(size=24, color="#FFFFFF"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><polyline points="20 6 9 17 4 12"/></svg>'

def svg_trophy(size=24, color="#FFD700"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>'

def svg_book(size=24, color="#58CC02"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/></svg>'

def svg_target(size=24, color="#E53935"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="none" stroke="{color}" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="{color}" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="{color}"/></svg>'

def svg_chart(size=24, color="#42A5F5"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M5 9.2h3V19H5V9.2zM10.6 5h2.8v14h-2.8V5zm5.6 8H19v6h-2.8v-6z"/></svg>'

def svg_sparkle(size=24, color="#FFD700"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M12 2L14 9L21 9L15.5 13.5L17.5 21L12 16.5L6.5 21L8.5 13.5L3 9L10 9L12 2Z"/></svg>'

def svg_x_mark(size=24, color="#E53935"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" stroke="{color}" stroke-width="3" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>'

def svg_lightbulb(size=24, color="#FFC107"):
    return f'<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="{color}" xmlns="http://www.w3.org/2000/svg"><path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/></svg>'


# ============================================================
# GAME CONSTANTS
# ============================================================
NUM_STAGES = 2
LEVELS_PER_STAGE = 5
TOTAL_LEVELS = NUM_STAGES * LEVELS_PER_STAGE
STAGE_ICONS = [svg_book(20, "#FFFFFF"), svg_chart(20, "#FFFFFF")]

# ============================================================
# ZIGZAG NODE POSITIONS (column index in 5-col grid)
# ============================================================
ZIGZAG = [2, 3, 2, 1, 2]
COL_X = {0: 10, 1: 30, 2: 50, 3: 70, 4: 90}

# ============================================================
# STATE INITIALIZATION
# ============================================================
def init_state():
    defaults = {
        "step": "map",
        "current_level": 0,
        "xp": 0,
        "streak": 0,
        "max_streak": 0,
        "question_index": 0,
        "test_answered": None,
        "practice_state": "answering",
        "session_xp": 0,
        "test_correct": 0,
        "test_total": 0,
        "current_questions": None,
        "data_loaded": False,
        "db_validated": False,
        "reattempt_count": 0,
        "weak_levels": set(),
        "reinforcement_questions": None,
        "rl_index": 0,
        "rl_selection": None,
        "rl_answered": 0,
        "rl_correct": 0,
        "practice_first_correct": 0,
        "practice_wrong_attempt": False,
    }
    for k, v in defaults.items():
        if k not in st.session_state:
            st.session_state[k] = v

init_state()

# ============================================================
# HELPER: Level math
# ============================================================
def get_stage_for_level(level_idx):
    """Returns 1-indexed stage number."""
    return (level_idx // LEVELS_PER_STAGE) + 1

def get_local_level(level_idx):
    """Returns 1-indexed level within stage."""
    return (level_idx % LEVELS_PER_STAGE) + 1

def get_total_levels():
    return TOTAL_LEVELS

def get_progress_pct():
    return int((st.session_state.current_level / TOTAL_LEVELS) * 100)

# ============================================================
# SUPABASE DATABASE LAYER
# ============================================================
@st.cache_resource
def init_supabase():
    """Initialize Supabase client. Checks st.secrets then env vars."""
    url = None
    key = None
    try:
        url = st.secrets.get("SUPABASE_URL")
        key = st.secrets.get("SUPABASE_KEY")
    except Exception:
        pass
    if not url:
        url = os.environ.get("SUPABASE_URL")
    if not key:
        key = os.environ.get("SUPABASE_KEY")
    if not url or not key:
        return None
    try:
        from supabase import create_client
        return create_client(url, key)
    except Exception:
        return None

@st.cache_data(ttl=300)
def validate_database():
    """Validate every (stage, level) pair has exactly 5 questions."""
    client = init_supabase()
    if not client:
        return False, "Unable to connect to database"
    try:
        resp = client.table("questions").select("stage, level").execute()
        if not resp.data:
            return False, "No questions found in database"
        counts = {}
        for row in resp.data:
            k = (row["stage"], row["level"])
            counts[k] = counts.get(k, 0) + 1
        for s in range(1, NUM_STAGES + 1):
            for lv in range(1, LEVELS_PER_STAGE + 1):
                c = counts.get((s, lv), 0)
                if c != 8:
                    return False, f"Database integrity error: each level must have 8 questions (Stage {s} Level {lv} has {c})"
        return True, "OK"
    except Exception as e:
        return False, f"Unable to connect to database: {str(e)}"

@st.cache_data(ttl=300)
def get_stage_topic(_stage: int) -> str:
    """Fetch stage topic name from the first question of that stage."""
    client = init_supabase()
    if not client:
        return f"Stage {_stage}"
    try:
        resp = (client.table("questions")
                .select("topic")
                .eq("stage", _stage)
                .limit(1)
                .execute())
        if resp.data and len(resp.data) > 0:
            return resp.data[0].get("topic", f"Stage {_stage}")
        return f"Stage {_stage}"
    except Exception:
        return f"Stage {_stage}"

@st.cache_data(ttl=300)
def fetch_core_questions(stage: int, level: int) -> list:
    """Fetch 5 core questions for a stage/level from Supabase."""
    client = init_supabase()
    if not client:
        return None
    try:
        resp = (client.table("questions")
                .select("*")
                .eq("stage", stage)
                .eq("level", level)
                .eq("question_type", "core")
                .order("question_order")
                .execute())
        if not resp.data or len(resp.data) != 5:
            return None
        processed = [process_question(row) for row in resp.data]
        if None in processed:
            return None
        return processed
    except Exception:
        return None

@st.cache_data(ttl=300)
def fetch_reinforcement_questions(stage: int, level: int) -> list:
    """Fetch 3 reinforcement questions for a stage/level from Supabase."""
    client = init_supabase()
    if not client:
        return None
    try:
        resp = (client.table("questions")
                .select("*")
                .eq("stage", stage)
                .eq("level", level)
                .eq("question_type", "reinforcement")
                .order("question_order")
                .execute())
        if not resp.data or len(resp.data) != 3:
            return None
        processed = [process_question(row) for row in resp.data]
        if None in processed:
            return None
        return processed
    except Exception:
        return None

@st.cache_data(ttl=300)
def get_lesson(stage: int, level: int) -> dict:
    """Fetch lesson content for a stage/level from the lessons table."""
    client = init_supabase()
    if not client:
        return None
    try:
        resp = (client.table("lessons")
                .select("topic, content")
                .eq("stage", stage)
                .eq("level", level)
                .limit(1)
                .execute())
        if resp.data and len(resp.data) > 0:
            return resp.data[0]
        return None
    except Exception:
        return None

def process_question(row):
    """Transform a DB row into the game question format."""
    option_map = {"A": 0, "B": 1, "C": 2, "D": 3}
    correct_letter = str(row.get("correct_option", "")).strip().upper()
    correct_idx = option_map.get(correct_letter)
    if correct_idx is None:
        return None
    return {
        "question": row.get("question", ""),
        "options": [
            row.get("option_a", ""),
            row.get("option_b", ""),
            row.get("option_c", ""),
            row.get("option_d", ""),
        ],
        "correct": correct_idx,
        "explanation": row.get("explanation", ""),
    }

def get_questions_for_level(abs_level_idx):
    """Get 5 core questions for a level from Supabase."""
    stage_num = get_stage_for_level(abs_level_idx)
    level_num = get_local_level(abs_level_idx)
    questions = fetch_core_questions(stage_num, level_num)
    if questions and len(questions) == 5:
        return questions
    return None

# ============================================================
# CSS INJECTION
# ============================================================
def inject_css():
    is_map = st.session_state.step == "map"
    base_css = f"""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&display=swap');
    * {{ font-family: 'Nunito', sans-serif !important; }}
    #MainMenu, header, footer, .stDeployButton {{ display: none !important; }}
    .block-container {{ padding-top: 80px !important; padding-bottom: 40px !important; max-width: 600px !important; }}
    .hud-bar {{
        position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        padding: 14px 24px; display: flex; justify-content: center; gap: 36px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        border-bottom: 2px solid rgba(88,204,2,0.3);
    }}
    .hud-item {{
        display: flex; align-items: center; gap: 8px;
        color: #ffffff; font-weight: 700; font-size: 15px;
    }}
    .hud-item .hud-val {{ font-size: 18px; font-weight: 900; }}
    @keyframes nodePulse {{
        0%, 100% {{ box-shadow: 0 0 20px rgba(88,204,2,0.4), 0 4px 12px rgba(0,0,0,0.2); transform: scale(1); }}
        50% {{ box-shadow: 0 0 35px rgba(88,204,2,0.7), 0 4px 20px rgba(0,0,0,0.25); transform: scale(1.08); }}
    }}
    @keyframes fadeInUp {{
        from {{ opacity: 0; transform: translateY(20px); }}
        to {{ opacity: 1; transform: translateY(0); }}
    }}
    @keyframes celebrate {{
        0%, 100% {{ transform: scale(1) rotate(0deg); }}
        25% {{ transform: scale(1.1) rotate(-3deg); }}
        75% {{ transform: scale(1.1) rotate(3deg); }}
    }}
    .lesson-card {{
        background: #ffffff; border-radius: 24px;
        padding: 32px 28px; margin: 16px 0;
        box-shadow: 0 8px 32px rgba(0,0,0,0.08);
        animation: fadeInUp 0.5s ease-out;
        border: 1px solid rgba(0,0,0,0.04);
    }}
    .lesson-card h2 {{ color: #1a1a2e; font-weight: 800; margin-bottom: 12px; font-size: 22px; }}
    .lesson-card .content {{ color: #4a4a4a; line-height: 1.7; font-size: 16px; }}
    .example-box {{
        background: linear-gradient(135deg, #e8f5e9, #f1f8e9);
        border-left: 4px solid #58CC02; border-radius: 12px;
        padding: 16px 20px; margin: 16px 0; font-size: 15px; color: #2e7d32;
    }}
    .feedback-correct {{
        background: linear-gradient(135deg, #e8f5e9, #c8e6c9);
        border: 2px solid #58CC02; border-radius: 16px;
        padding: 16px 20px; margin: 12px 0; display: flex; align-items: center; gap: 12px;
        animation: fadeInUp 0.3s ease-out;
    }}
    .feedback-correct span {{ color: #2e7d32; font-weight: 700; font-size: 16px; }}
    .feedback-wrong {{
        background: linear-gradient(135deg, #ffebee, #ffcdd2);
        border: 2px solid #ef5350; border-radius: 16px;
        padding: 16px 20px; margin: 12px 0; display: flex; align-items: center; gap: 12px;
        animation: fadeInUp 0.3s ease-out;
    }}
    .feedback-wrong span {{ color: #c62828; font-weight: 700; font-size: 16px; }}
    .hint-box {{
        background: linear-gradient(135deg, #fff3e0, #ffe0b2);
        border-left: 4px solid #FF9800; border-radius: 12px;
        padding: 14px 18px; margin: 10px 0; color: #e65100; font-size: 14px;
    }}
    .reward-container {{ text-align: center; padding: 20px 0; animation: fadeInUp 0.6s ease-out; }}
    .reward-trophy {{ animation: celebrate 1s ease-in-out infinite; display: inline-block; }}
    .reward-xp {{
        font-size: 48px; font-weight: 900;
        background: linear-gradient(135deg, #FFD700, #FFA000);
        -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        background-clip: text;
    }}
    .reward-streak-badge {{
        display: inline-block; background: linear-gradient(135deg, #FF6B35, #FF8A65);
        color: white; padding: 8px 20px; border-radius: 25px; font-weight: 700; margin: 8px 4px;
    }}
    .step-label {{
        display: inline-flex; align-items: center; gap: 8px;
        background: rgba(88,204,2,0.1); color: #2e7d32;
        padding: 6px 16px; border-radius: 20px; font-weight: 700;
        font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 8px;
    }}
    .q-counter {{
        background: #1a1a2e; color: #fff; padding: 4px 14px;
        border-radius: 15px; font-size: 13px; font-weight: 700;
        display: inline-block; margin-bottom: 12px;
    }}
    """
    map_extra = """
    .stApp {
        background: linear-gradient(180deg,
            #87CEEB 0%, #98D8E8 8%, #B8E6D0 18%,
            #C8E6C9 28%, #A5D6A7 42%, #81C784 58%,
            #66BB6A 72%, #4CAF50 85%, #388E3C 100%
        ) !important;
    }
    .stButton > button {
        border-radius: 50% !important; width: 72px !important; height: 72px !important;
        padding: 0 !important; min-height: 0 !important; line-height: 1 !important;
        background: linear-gradient(145deg, #58CC02, #46a301) !important;
        border: 4px solid #3d8b01 !important; color: white !important;
        font-size: 22px !important; font-weight: 900 !important;
        animation: nodePulse 2s ease-in-out infinite !important;
        cursor: pointer !important;
        box-shadow: 0 0 25px rgba(88,204,2,0.5), 0 6px 16px rgba(0,0,0,0.2) !important;
    }
    .stButton > button:hover {
        transform: scale(1.12) !important;
        box-shadow: 0 0 35px rgba(88,204,2,0.7), 0 8px 24px rgba(0,0,0,0.25) !important;
    }
    .stButton > button:active { transform: scale(0.95) !important; }
    .stage-banner {
        background: linear-gradient(135deg, #1a1a2e, #16213e);
        color: #fff; padding: 12px 24px; border-radius: 20px;
        font-weight: 800; font-size: 16px; text-align: center;
        margin: 24px auto 14px auto; max-width: 280px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.3);
        display: flex; align-items: center; justify-content: center; gap: 10px;
    }
    .node-completed {
        width: 64px; height: 64px; border-radius: 50%;
        background: linear-gradient(145deg, #58CC02, #3d8b01);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto; position: relative;
        border: 3px solid #2d7a01;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        color: white; font-weight: 800; font-size: 18px;
    }
    .node-completed .check-badge {
        position: absolute; bottom: -4px; right: -4px;
        background: #2d7a01; border-radius: 50%;
        width: 24px; height: 24px;
        display: flex; align-items: center; justify-content: center;
        border: 2px solid #fff;
    }
    .node-locked {
        width: 56px; height: 56px; border-radius: 50%;
        background: linear-gradient(145deg, #bdbdbd, #9e9e9e);
        display: flex; align-items: center; justify-content: center;
        margin: 0 auto;
        border: 3px solid #8a8a8a;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        opacity: 0.7;
    }
    .level-title {
        text-align: center; font-size: 11px; font-weight: 700;
        color: rgba(0,0,0,0.5); margin-top: 6px;
        max-width: 90px; margin-left: auto; margin-right: auto; line-height: 1.2;
    }
    .level-title-active { color: #1a1a2e !important; font-weight: 800 !important; font-size: 12px !important; }
    """
    lesson_extra = """
    .stApp {
        background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%) !important;
    }
    .stButton > button {
        border-radius: 25px !important; padding: 14px 36px !important;
        font-size: 16px !important; font-weight: 700 !important;
        min-height: 0 !important; transition: all 0.2s ease !important; border: none !important;
    }
    .stButton > button[kind="primary"], .stButton > button[data-testid="baseButton-primary"] {
        background: linear-gradient(135deg, #58CC02, #46a301) !important;
        color: white !important; box-shadow: 0 4px 16px rgba(88,204,2,0.3) !important;
    }
    .stButton > button[kind="primary"]:hover, .stButton > button[data-testid="baseButton-primary"]:hover {
        transform: translateY(-2px) !important;
        box-shadow: 0 6px 24px rgba(88,204,2,0.4) !important;
    }
    .stButton > button[kind="secondary"], .stButton > button[data-testid="baseButton-secondary"] {
        background: #ffffff !important; color: #333 !important;
        border: 2px solid #e0e0e0 !important;
    }
    .stButton > button[kind="secondary"]:hover, .stButton > button[data-testid="baseButton-secondary"]:hover {
        border-color: #58CC02 !important; background: #f8fff0 !important;
        transform: translateX(4px) !important;
    }
    """
    st.markdown(base_css + (map_extra if is_map else lesson_extra) + "</style>", unsafe_allow_html=True)


# ============================================================
# HUD BAR
# ============================================================
def render_hud():
    xp = st.session_state.xp
    streak = st.session_state.streak
    progress = get_progress_pct()
    st.markdown(f'''
    <div class="hud-bar">
        <div class="hud-item">{svg_star(22, "#FFD700")} <span class="hud-val">{xp}</span> XP</div>
        <div class="hud-item">{svg_flame(22, "#FF6B35")} <span class="hud-val">{streak}</span></div>
        <div class="hud-item">{svg_chart(22, "#42A5F5")} <span class="hud-val">{progress}%</span></div>
    </div>
    ''', unsafe_allow_html=True)


# ============================================================
# MAP CONNECTORS
# ============================================================
def render_connector(from_col, to_col, completed=False):
    x1 = COL_X[from_col]
    x2 = COL_X[to_col]
    color = "rgba(88,204,2,0.5)" if completed else "rgba(158,158,158,0.3)"
    w = "3" if completed else "2.5"
    dash = "" if completed else 'stroke-dasharray="6,4"'
    st.markdown(f'''
    <div style="max-width:420px; margin:-6px auto; height:36px;">
        <svg width="100%" height="36" viewBox="0 0 100 36" preserveAspectRatio="none">
            <path d="M {x1} 0 C {x1} 18, {x2} 18, {x2} 36"
                  stroke="{color}" stroke-width="{w}" fill="none" stroke-linecap="round" {dash}/>
        </svg>
    </div>
    ''', unsafe_allow_html=True)


# ============================================================
# MAP SCREEN
# ============================================================
def render_map():
    current = st.session_state.current_level
    total = get_total_levels()

    st.markdown(f'''
    <div style="text-align:center; padding: 8px 0 20px 0; animation: fadeInUp 0.5s ease-out;">
        <div style="font-size: 28px; font-weight: 900; color: #1a1a2e; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            {svg_sparkle(28, "#FFD700")} FinQuest {svg_sparkle(28, "#FFD700")}
        </div>
        <div style="font-size: 13px; color: rgba(0,0,0,0.5); font-weight: 600; margin-top: 2px;">
            Level Up Your Financial Skills
        </div>
    </div>
    ''', unsafe_allow_html=True)

    level_counter = 0
    for stage_idx in range(NUM_STAGES):
        stage_num = stage_idx + 1
        topic = get_stage_topic(stage_num)
        icon = STAGE_ICONS[stage_idx] if stage_idx < len(STAGE_ICONS) else svg_book(20, "#FFFFFF")
        st.markdown(f'''
        <div class="stage-banner">
            {icon} Stage {stage_num}: {topic}
        </div>
        ''', unsafe_allow_html=True)

        for local_idx in range(LEVELS_PER_STAGE):
            abs_idx = level_counter
            col_pos = ZIGZAG[local_idx]
            level_label = f"Level {local_idx + 1}"

            if local_idx > 0:
                prev_col = ZIGZAG[local_idx - 1]
                render_connector(prev_col, col_pos, abs_idx <= current)

            cols = st.columns(5)
            with cols[col_pos]:
                if abs_idx < current:
                    st.markdown(f'''
                    <div class="node-completed">
                        {abs_idx + 1}
                        <div class="check-badge">{svg_check(14)}</div>
                    </div>
                    <div class="level-title">{level_label}</div>
                    ''', unsafe_allow_html=True)
                elif abs_idx == current:
                    if st.button(f"{abs_idx + 1}", key=f"map_node_{abs_idx}"):
                        st.session_state.step = "teach"
                        st.session_state.session_xp = 0
                        st.session_state.test_correct = 0
                        st.session_state.question_index = 0
                        st.session_state.test_answered = None
                        st.session_state.practice_state = "answering"
                        st.session_state.current_questions = get_questions_for_level(abs_idx)
                        st.session_state.data_loaded = True
                        st.session_state.reattempt_count = 0
                        st.session_state.practice_first_correct = 0
                        st.session_state.practice_wrong_attempt = False
                        st.rerun()
                    st.markdown(f'<div class="level-title level-title-active">{level_label}</div>', unsafe_allow_html=True)
                else:
                    st.markdown(f'''
                    <div class="node-locked">{svg_lock(22)}</div>
                    <div class="level-title">{level_label}</div>
                    ''', unsafe_allow_html=True)
            level_counter += 1

        if stage_idx < NUM_STAGES - 1:
            last_col = ZIGZAG[LEVELS_PER_STAGE - 1]
            first_col_next = ZIGZAG[0]
            st.markdown('<div style="height:10px;"></div>', unsafe_allow_html=True)
            render_connector(last_col, first_col_next, level_counter <= current)

    if current >= total:
        st.markdown(f'''
        <div style="text-align:center; padding: 30px 0; animation: fadeInUp 0.6s ease-out;">
            <div style="font-size:36px; margin-bottom:8px;">{svg_trophy(48)}</div>
            <div style="font-size:22px; font-weight:900; color:#1a1a2e;">All Levels Complete!</div>
            <div style="font-size:14px; color:#666; margin-top:4px;">You are a financial master!</div>
        </div>
        ''', unsafe_allow_html=True)


# ============================================================
# TEACH SCREEN
# ============================================================
def render_teach():
    questions = st.session_state.get("current_questions")
    if not questions or len(questions) < 5:
        st.markdown(f'''
        <div class="lesson-card">
            <h2 style="color:#c62828;">Content Unavailable</h2>
            <div class="content">Could not load lesson data for this level. Please return to the map and try again.</div>
        </div>
        ''', unsafe_allow_html=True)
        c1, c2, c3 = st.columns([1, 2, 1])
        with c2:
            if st.button("Back to Map", key="teach_back", type="primary", use_container_width=True):
                st.session_state.step = "map"
                st.rerun()
        return
    first_q = questions[0]
    stage_num = get_stage_for_level(st.session_state.current_level)
    level_num = get_local_level(st.session_state.current_level)
    lesson = get_lesson(stage_num, level_num)
    if lesson:
        topic = lesson.get("topic", get_stage_topic(stage_num))
        teach_content = lesson.get("content", "")
    else:
        topic = get_stage_topic(stage_num)
        teach_content = first_q.get("explanation", "")
    title = f"{topic} — Level {level_num}"
    st.markdown(f'<div class="step-label">{svg_lightbulb(16)} LEARN</div>', unsafe_allow_html=True)
    st.markdown(f'''
    <div class="lesson-card">
        <h2>{title}</h2>
        <div class="content">{teach_content}</div>
        <div class="example-box">
            {svg_lightbulb(18, "#66BB6A")} <strong style="color:#2e7d32;"> Practice Question Preview</strong><br>
            {first_q["question"]}
        </div>
    </div>
    ''', unsafe_allow_html=True)
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        if st.button("Got it! Continue", key="teach_continue", type="primary", use_container_width=True):
            st.session_state.step = "practice"
            st.session_state.practice_state = "answering"
            st.rerun()


# ============================================================
# PRACTICE SCREEN
# ============================================================
def render_practice():
    questions = st.session_state.get("current_questions")
    if not questions or len(questions) < 5:
        st.markdown('''
        <div class="lesson-card">
            <h2 style="color:#c62828;">Data Error</h2>
            <div class="content">No questions found for this level. Please return to the map.</div>
        </div>
        ''', unsafe_allow_html=True)
        return
    practice = questions[0]
    hint_text = practice.get("explanation") or "Think carefully about all the options!"
    st.markdown(f'<div class="step-label">{svg_target(16, "#58CC02")} PRACTICE</div>', unsafe_allow_html=True)
    st.markdown(f'''
    <div class="lesson-card">
        <h2>Guided Practice</h2>
        <div class="content" style="font-size:17px; font-weight:600; color:#1a1a2e;">{practice["question"]}</div>
    </div>
    ''', unsafe_allow_html=True)
    state = st.session_state.practice_state
    if state == "answering":
        for i, opt in enumerate(practice["options"]):
            if st.button(opt, key=f"practice_opt_{i}", type="secondary", use_container_width=True):
                if i == practice["correct"]:
                    st.session_state.practice_state = "correct"
                    if not st.session_state.practice_wrong_attempt:
                        st.session_state.practice_first_correct = 1
                    st.session_state.streak += 1
                    st.session_state.max_streak = max(st.session_state.max_streak, st.session_state.streak)
                    bonus = 10 if st.session_state.streak >= 5 else (5 if st.session_state.streak >= 3 else 0)
                    earned = 10 + bonus
                    st.session_state.xp += earned
                    st.session_state.session_xp += earned
                else:
                    st.session_state.practice_state = "wrong"
                    st.session_state.practice_wrong_attempt = True
                    st.session_state.streak = 0
                st.rerun()
    elif state == "wrong":
        st.markdown(f'''
        <div class="feedback-wrong">{svg_x_mark(22)} <span>Not quite right!</span></div>
        <div class="hint-box">{svg_lightbulb(16)} <strong>Hint:</strong> {hint_text}</div>
        ''', unsafe_allow_html=True)
        c1, c2, c3 = st.columns([1, 2, 1])
        with c2:
            if st.button("Try Again", key="practice_retry", type="primary", use_container_width=True):
                st.session_state.practice_state = "answering"
                st.rerun()
    elif state == "correct":
        streak = st.session_state.streak
        bonus = 10 if streak >= 5 else (5 if streak >= 3 else 0)
        st.markdown(f'''
        <div class="feedback-correct">{svg_check(22, "#2e7d32")} <span>Correct! +{10 + bonus} XP</span></div>
        ''', unsafe_allow_html=True)
        if practice.get("explanation"):
            st.markdown(f'''
            <div class="example-box">
                {svg_lightbulb(18, "#66BB6A")} <strong style="color:#2e7d32;"> Why?</strong><br>
                {practice["explanation"]}
            </div>
            ''', unsafe_allow_html=True)
        if streak >= 3:
            st.markdown(f'<div class="reward-streak-badge">{svg_flame(16, "#fff")} Streak Bonus! x{streak}</div>', unsafe_allow_html=True)
        c1, c2, c3 = st.columns([1, 2, 1])
        with c2:
            if st.button("Continue to Test", key="practice_continue", type="primary", use_container_width=True):
                st.session_state.step = "test"
                st.session_state.question_index = 0
                st.session_state.test_answered = None
                st.session_state.test_correct = 0
                st.session_state.test_total = 4
                st.rerun()


# ============================================================
# TEST SCREEN
# ============================================================
def render_test():
    questions_all = st.session_state.get("current_questions")
    if not questions_all or len(questions_all) < 5:
        st.markdown('''
        <div class="lesson-card">
            <h2 style="color:#c62828;">Data Error</h2>
            <div class="content">Incomplete data for this level.</div>
        </div>
        ''', unsafe_allow_html=True)
        return
    test_questions = questions_all[1:5]
    q_idx = st.session_state.question_index
    if q_idx >= len(test_questions):
        st.session_state.step = "reward"
        st.rerun()
        return
    q = test_questions[q_idx]
    total_q = len(test_questions)
    st.markdown(f'<div class="step-label">{svg_target(16, "#E53935")} TEST</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="q-counter">Question {q_idx + 1} of {total_q}</div>', unsafe_allow_html=True)
    pct = int((q_idx / total_q) * 100)
    st.markdown(f'''
    <div style="background:#e0e0e0; border-radius:10px; height:8px; max-width:300px; margin:0 auto 16px auto; overflow:hidden;">
        <div style="background:linear-gradient(90deg,#58CC02,#46a301); height:100%; width:{pct}%; border-radius:10px; transition:width 0.4s ease;"></div>
    </div>
    ''', unsafe_allow_html=True)
    st.markdown(f'''
    <div class="lesson-card">
        <div class="content" style="font-size:17px; font-weight:600; color:#1a1a2e;">{q["question"]}</div>
    </div>
    ''', unsafe_allow_html=True)
    answered = st.session_state.test_answered
    if answered is None:
        for i, opt in enumerate(q["options"]):
            if st.button(opt, key=f"test_q{q_idx}_opt_{i}", type="secondary", use_container_width=True):
                st.session_state.test_answered = i
                if i == q["correct"]:
                    st.session_state.test_correct += 1
                    st.session_state.streak += 1
                    st.session_state.max_streak = max(st.session_state.max_streak, st.session_state.streak)
                    bonus = 10 if st.session_state.streak >= 5 else (5 if st.session_state.streak >= 3 else 0)
                    earned = 10 + bonus
                    st.session_state.xp += earned
                    st.session_state.session_xp += earned
                else:
                    st.session_state.streak = 0
                st.rerun()
    else:
        is_correct = answered == q["correct"]
        if is_correct:
            streak = st.session_state.streak
            bonus = 10 if streak >= 5 else (5 if streak >= 3 else 0)
            st.markdown(f'<div class="feedback-correct">{svg_check(22, "#2e7d32")} <span>Correct! +{10 + bonus} XP</span></div>', unsafe_allow_html=True)
        else:
            correct_text = q["options"][q["correct"]]
            st.markdown(f'<div class="feedback-wrong">{svg_x_mark(22)} <span>Wrong! Answer: {correct_text}</span></div>', unsafe_allow_html=True)
        if q.get("explanation"):
            st.markdown(f'''
            <div class="example-box">
                {svg_lightbulb(18, "#66BB6A")} <strong style="color:#2e7d32;"> Explanation</strong><br>
                {q["explanation"]}
            </div>
            ''', unsafe_allow_html=True)
        c1, c2, c3 = st.columns([1, 2, 1])
        with c2:
            btn_label = "Next Question" if q_idx < total_q - 1 else "See Results"
            if st.button(btn_label, key=f"test_next_{q_idx}", type="primary", use_container_width=True):
                st.session_state.question_index += 1
                st.session_state.test_answered = None
                st.rerun()


# ============================================================
# REWARD SCREEN
# ============================================================
def render_reward():
    session_xp = st.session_state.session_xp
    streak = st.session_state.streak
    max_streak = st.session_state.max_streak
    correct = st.session_state.test_correct
    test_total = st.session_state.test_total
    total_levels = get_total_levels()
    stage_num = get_stage_for_level(st.session_state.current_level)
    level_num = get_local_level(st.session_state.current_level)
    topic = get_stage_topic(stage_num)
    level_title = f"{topic} — Level {level_num}"

    st.markdown(f'''
    <div class="reward-container">
        <div class="reward-trophy">{svg_trophy(72)}</div>
        <h1 style="color:#1a1a2e; font-weight:900; margin:12px 0 4px 0; font-size:28px;">Level Complete!</h1>
        <p style="color:#666; font-size:15px; margin-bottom:24px;">{level_title}</p>
    </div>
    ''', unsafe_allow_html=True)

    st.markdown(f'''
    <div style="display:flex; gap:12px; justify-content:center; flex-wrap:wrap; margin:16px 0;">
        <div style="background:#fff; border-radius:20px; padding:20px 28px; text-align:center;
             box-shadow:0 4px 16px rgba(0,0,0,0.06); min-width:110px;">
            {svg_star(28, "#FFD700")}
            <div class="reward-xp" style="font-size:32px;">+{session_xp}</div>
            <div style="color:#999; font-size:13px; font-weight:600;">XP Earned</div>
        </div>
        <div style="background:#fff; border-radius:20px; padding:20px 28px; text-align:center;
             box-shadow:0 4px 16px rgba(0,0,0,0.06); min-width:110px;">
            {svg_flame(28)}
            <div style="font-size:32px; font-weight:900; color:#FF6B35;">{streak}</div>
            <div style="color:#999; font-size:13px; font-weight:600;">Current Streak</div>
        </div>
        <div style="background:#fff; border-radius:20px; padding:20px 28px; text-align:center;
             box-shadow:0 4px 16px rgba(0,0,0,0.06); min-width:110px;">
            {svg_target(28, "#58CC02")}
            <div style="font-size:32px; font-weight:900; color:#58CC02;">{correct}/{test_total}</div>
            <div style="color:#999; font-size:13px; font-weight:600;">Test Score</div>
        </div>
    </div>
    ''', unsafe_allow_html=True)

    if max_streak >= 3:
        st.markdown(f'''
        <div style="text-align:center; margin:16px 0;">
            <div class="reward-streak-badge">{svg_flame(16, "#fff")} Best Streak: {max_streak}</div>
        </div>
        ''', unsafe_allow_html=True)

    # --- Adaptive completion logic ---
    level_score = st.session_state.practice_first_correct + st.session_state.test_correct
    passed = level_score >= 4

    # Debug logging
    print(f"[REWARD] Stage={stage_num} Level={level_num} | practice_first_correct={st.session_state.practice_first_correct} test_correct={st.session_state.test_correct} level_score={level_score} passed={passed}")
    print(f"[REWARD] Weak Levels: {st.session_state.weak_levels}")

    if passed:
        st.markdown(f'''
        <div style="text-align:center; margin:8px 0;">
            <div style="display:inline-block; background:linear-gradient(135deg,#58CC02,#46a301);
                 color:white; padding:8px 24px; border-radius:25px; font-weight:700; font-size:15px;">
                {svg_check(18)} LEVEL PASSED — {level_score}/5
            </div>
        </div>
        ''', unsafe_allow_html=True)
    else:
        st.markdown(f'''
        <div style="text-align:center; margin:8px 0;">
            <div style="display:inline-block; background:linear-gradient(135deg,#FF9800,#F57C00);
                 color:white; padding:8px 24px; border-radius:25px; font-weight:700; font-size:15px;">
                Score {level_score}/5 — Need 4 to pass
            </div>
        </div>
        ''', unsafe_allow_html=True)

    st.markdown('<div style="height:12px;"></div>', unsafe_allow_html=True)
    c1, c2, c3 = st.columns([1, 2, 1])
    with c2:
        if passed:
            is_last = st.session_state.current_level >= total_levels - 1
            is_stage_last = get_local_level(st.session_state.current_level) == LEVELS_PER_STAGE
            completed_stage = get_stage_for_level(st.session_state.current_level)
            btn_text = "Back to Map" if is_last else "Next Level"
            if st.button(btn_text, key="reward_continue", type="primary", use_container_width=True):
                st.session_state.reattempt_count = 0
                if not is_last:
                    st.session_state.current_level += 1
                # Reset session
                st.session_state.session_xp = 0
                st.session_state.test_correct = 0
                st.session_state.question_index = 0
                st.session_state.test_answered = None
                st.session_state.practice_state = "answering"
                st.session_state.practice_first_correct = 0
                st.session_state.practice_wrong_attempt = False
                # Check if stage completed and weak levels exist
                if is_stage_last and st.session_state.weak_levels:
                    print(f"[REINFORCEMENT] Triggering for stage {completed_stage}, weak_levels: {st.session_state.weak_levels}")
                    rl_questions = []
                    for ws, wl in st.session_state.weak_levels:
                        qs = fetch_reinforcement_questions(ws, wl)
                        if qs:
                            rl_questions.extend(qs)
                    if rl_questions:
                        st.session_state.reinforcement_questions = rl_questions
                        st.session_state.rl_index = 0
                        st.session_state.rl_selection = None
                        st.session_state.rl_answered = 0
                        st.session_state.rl_correct = 0
                        st.session_state.step = "reinforcement"
                        st.rerun()
                    else:
                        st.session_state.weak_levels = set()
                st.session_state.step = "map"
                st.rerun()
        else:
            if st.button("Retry Level", key="reward_retry", type="primary", use_container_width=True):
                st.session_state.reattempt_count += 1
                # Always mark as weak on fail
                s_num = get_stage_for_level(st.session_state.current_level)
                l_num = get_local_level(st.session_state.current_level)
                st.session_state.weak_levels.add((s_num, l_num))
                print(f"[FAIL] Added ({s_num},{l_num}) to weak_levels: {st.session_state.weak_levels}")
                # Retry same level with same core questions
                st.session_state.step = "teach"
                st.session_state.session_xp = 0
                st.session_state.test_correct = 0
                st.session_state.question_index = 0
                st.session_state.test_answered = None
                st.session_state.practice_state = "answering"
                st.session_state.practice_first_correct = 0
                st.session_state.practice_wrong_attempt = False
                st.rerun()


# ============================================================
# REINFORCEMENT SCREEN
# ============================================================
def render_reinforcement():
    """Reinforcement phase for weak levels after stage completion."""
    rl_qs = st.session_state.get("reinforcement_questions")
    if not rl_qs or len(rl_qs) == 0:
        st.session_state.step = "map"
        st.session_state.weak_levels = set()
        st.session_state.reinforcement_questions = None
        st.rerun()
        return

    q_idx = st.session_state.rl_index
    total_q = len(rl_qs)

    # All questions answered -> show summary
    if q_idx >= total_q:
        rl_correct = st.session_state.rl_correct
        rl_answered = st.session_state.rl_answered
        score_text = f"{rl_correct}/{rl_answered}" if rl_answered > 0 else "0/0"
        print(f"[REINFORCEMENT] Complete: {score_text}")
        st.markdown(f'''
        <div class="reward-container">
            <div class="reward-trophy">{svg_trophy(72)}</div>
            <h1 style="color:#1a1a2e; font-weight:900; margin:12px 0 4px 0; font-size:28px;">Review Complete!</h1>
            <p style="color:#666; font-size:15px; margin-bottom:24px;">You reviewed your weak levels</p>
        </div>
        ''', unsafe_allow_html=True)
        st.markdown(f'''
        <div style="display:flex; gap:12px; justify-content:center; margin:16px 0;">
            <div style="background:#fff; border-radius:20px; padding:20px 28px; text-align:center;
                 box-shadow:0 4px 16px rgba(0,0,0,0.06); min-width:110px;">
                {svg_target(28, "#FF9800")}
                <div style="font-size:32px; font-weight:900; color:#FF9800;">{score_text}</div>
                <div style="color:#999; font-size:13px; font-weight:600;">Review Score</div>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        c1, c2, c3 = st.columns([1, 2, 1])
        with c2:
            if st.button("Continue", key="rl_done", type="primary", use_container_width=True):
                st.session_state.weak_levels = set()
                st.session_state.reattempt_count = 0
                st.session_state.reinforcement_questions = None
                st.session_state.rl_index = 0
                st.session_state.rl_selection = None
                st.session_state.rl_answered = 0
                st.session_state.rl_correct = 0
                st.session_state.step = "map"
                st.rerun()
        return

    q = rl_qs[q_idx]
    st.markdown(f'<div class="step-label">{svg_lightbulb(16)} REINFORCEMENT</div>', unsafe_allow_html=True)
    st.markdown(f'<div class="q-counter">Question {q_idx + 1} of {total_q}</div>', unsafe_allow_html=True)
    pct = int((q_idx / total_q) * 100)
    st.markdown(f'''
    <div style="background:#e0e0e0; border-radius:10px; height:8px; max-width:300px; margin:0 auto 16px auto; overflow:hidden;">
        <div style="background:linear-gradient(90deg,#FF9800,#F57C00); height:100%; width:{pct}%; border-radius:10px; transition:width 0.4s ease;"></div>
    </div>
    ''', unsafe_allow_html=True)
    st.markdown(f'''
    <div class="lesson-card">
        <div class="content" style="font-size:17px; font-weight:600; color:#1a1a2e;">{q["question"]}</div>
    </div>
    ''', unsafe_allow_html=True)

    selection = st.session_state.rl_selection
    if selection is None:
        for i, opt in enumerate(q["options"]):
            if st.button(opt, key=f"rl_q{q_idx}_opt_{i}", type="secondary", use_container_width=True):
                st.session_state.rl_selection = i
                st.session_state.rl_answered += 1
                if i == q["correct"]:
                    st.session_state.rl_correct += 1
                    st.session_state.streak += 1
                    st.session_state.max_streak = max(st.session_state.max_streak, st.session_state.streak)
                    bonus = 10 if st.session_state.streak >= 5 else (5 if st.session_state.streak >= 3 else 0)
                    earned = 10 + bonus
                    st.session_state.xp += earned
                else:
                    st.session_state.streak = 0
                st.rerun()
    else:
        is_correct = selection == q["correct"]
        if is_correct:
            streak = st.session_state.streak
            bonus = 10 if streak >= 5 else (5 if streak >= 3 else 0)
            st.markdown(f'<div class="feedback-correct">{svg_check(22, "#2e7d32")} <span>Correct! +{10 + bonus} XP</span></div>', unsafe_allow_html=True)
        else:
            correct_text = q["options"][q["correct"]]
            st.markdown(f'<div class="feedback-wrong">{svg_x_mark(22)} <span>Wrong! Answer: {correct_text}</span></div>', unsafe_allow_html=True)
        if q.get("explanation"):
            st.markdown(f'''
            <div class="example-box">
                {svg_lightbulb(18, "#66BB6A")} <strong style="color:#2e7d32;"> Explanation</strong><br>
                {q["explanation"]}
            </div>
            ''', unsafe_allow_html=True)
        c1, c2, c3 = st.columns([1, 2, 1])
        with c2:
            btn_label = "Next Question" if q_idx < total_q - 1 else "See Results"
            if st.button(btn_label, key=f"rl_next_{q_idx}", type="primary", use_container_width=True):
                st.session_state.rl_index += 1
                st.session_state.rl_selection = None
                st.rerun()


# ============================================================
# MAIN
# ============================================================
def main():
    inject_css()
    render_hud()
    # Require Supabase connection
    supabase_client = init_supabase()
    if not supabase_client:
        st.markdown(f'''
        <div class="lesson-card" style="max-width:500px; margin:40px auto; text-align:center;">
            <h2 style="color:#c62828;">{svg_target(28, "#c62828")} Connection Required</h2>
            <div class="content" style="margin:16px 0;">
                FinQuest needs a database connection to load content.<br><br>
                Please set <code>SUPABASE_URL</code> and <code>SUPABASE_KEY</code><br>
                in your environment or <code>.streamlit/secrets.toml</code>
            </div>
        </div>
        ''', unsafe_allow_html=True)
        return
    # Database validation (cached, runs once)
    if not st.session_state.get("db_validated"):
        valid, msg = validate_database()
        if not valid:
            st.markdown(f'''
            <div class="lesson-card" style="max-width:500px; margin:40px auto; text-align:center;">
                <h2 style="color:#c62828;">{svg_target(28, "#c62828")} Database Issue</h2>
                <div class="content" style="margin:16px 0;">{msg}</div>
            </div>
            ''', unsafe_allow_html=True)
            return
        st.session_state.db_validated = True
    step = st.session_state.step
    if step == "map":
        render_map()
    elif step == "teach":
        render_teach()
    elif step == "practice":
        render_practice()
    elif step == "test":
        render_test()
    elif step == "reward":
        render_reward()
    elif step == "reinforcement":
        render_reinforcement()

if __name__ == "__main__":
    main()
