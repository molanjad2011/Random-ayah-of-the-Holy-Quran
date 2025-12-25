import gi
import requests
import random

gi.require_version("Gtk", "3.0")
from gi.repository import Gtk, Pango, Gdk

sura_verses = {
    1: 7,
    2: 286,
    3: 200,
    4: 176,
    5: 120,
    6: 165,
    7: 206,
    8: 75,
    9: 129,
    10: 109,
    11: 123,
    12: 111,
    13: 43,
    14: 52,
    15: 99,
    16: 128,
    17: 111,
    18: 110,
    19: 98,
    20: 135,
    21: 112,
    22: 78,
    23: 118,
    24: 64,
    25: 77,
    26: 227,
    27: 93,
    28: 88,
    29: 69,
    30: 60,
    31: 34,
    32: 30,
    33: 73,
    34: 54,
    35: 45,
    36: 83,
    37: 182,
    38: 88,
    39: 75,
    40: 85,
    41: 54,
    42: 53,
    43: 89,
    44: 59,
    45: 37,
    46: 35,
    47: 38,
    48: 29,
    49: 18,
    50: 45,
    51: 60,
    52: 49,
    53: 62,
    54: 55,
    55: 78,
    56: 96,
    57: 29,
    58: 22,
    59: 24,
    60: 13,
    61: 14,
    62: 11,
    63: 11,
    64: 18,
    65: 12,
    66: 12,
    67: 30,
    68: 52,
    69: 52,
    70: 44,
    71: 28,
    72: 28,
    73: 20,
    74: 56,
    75: 40,
    76: 31,
    77: 50,
    78: 40,
    79: 46,
    80: 42,
    81: 29,
    82: 19,
    83: 36,
    84: 25,
    85: 22,
    86: 17,
    87: 19,
    88: 26,
    89: 30,
    90: 20,
    91: 15,
    92: 21,
    93: 11,
    94: 8,
    95: 8,
    96: 19,
    97: 5,
    98: 8,
    99: 8,
    100: 11,
    101: 11,
    102: 8,
    103: 3,
    104: 9,
    105: 5,
    106: 4,
    107: 7,
    108: 3,
    109: 6,
    110: 3,
    111: 5,
    112: 4,
    113: 5,
    114: 6
}


EDITION = "quran-simple"

def get_random_ayah():
    sura = random.choice(list(sura_verses.keys()))
    ayah = random.randint(1, sura_verses[sura])
    url = f"http://api.alquran.cloud/v1/ayah/{sura}:{ayah}/{EDITION}"
    try:
        res = requests.get(url, timeout=5)
        data = res.json()
        text = data.get("data", {}).get("text", "not found")
        surah_name = data.get("data", {}).get("surah", {}).get("name", "")
        number = data.get("data", {}).get("numberInSurah", "")
        return f"{text}\n\nسوره: {surah_name}, آیه: {number}"
    except Exception as e:
        return f"Error: {e}"

class QuranApp(Gtk.Window):
    def __init__(self):
        super().__init__(title="holy quran")
        self.set_default_size(700, 500)
        self.set_border_width(20)

        css_provider = Gtk.CssProvider()
        css = """
        window {
            background-color: #011627;
        }
        textview {
            background-color: rgba(20,30,50,0.85);
            color: #d6deeb;
            border-radius: 15px;
            padding: 15px;
        }
        button {
            background-color: #7fdbca;
            color: #011627;
            border-radius: 12px;
            padding: 10px;
            font-weight: bold;
        }
        button:hover {
            background-color: #50bfa0;
        }
        """
        css_provider.load_from_data(css.encode())
        Gtk.StyleContext.add_provider_for_screen(
            Gdk.Screen.get_default(), css_provider, Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION
        )

        vbox = Gtk.Box(orientation=Gtk.Orientation.VERTICAL, spacing=20)
        self.add(vbox)

        self.label = Gtk.Label(label="--- holy quran ---")
        self.label.set_justify(Gtk.Justification.CENTER)
        self.label.modify_font(Pango.FontDescription("Estedad 28"))
        self.label.set_halign(Gtk.Align.CENTER)
        self.label.set_valign(Gtk.Align.START)
        vbox.pack_start(self.label, False, False, 0)

        self.textview = Gtk.TextView()
        self.textview.set_editable(False)
        self.textview.set_cursor_visible(False)
        self.textbuffer = self.textview.get_buffer()
        self.textview.modify_font(Pango.FontDescription("Estedad 20"))
        vbox.pack_start(self.textview, True, True, 0)

        self.button = Gtk.Button(label="next")
        self.button.connect("clicked", self.on_button_click)
        vbox.pack_start(self.button, False, False, 0)

        self.load_ayah()

    def load_ayah(self):
        ayah_text = get_random_ayah()
        self.textbuffer.set_text(ayah_text)

    def on_button_click(self, widget):
        self.load_ayah()

if __name__ == "__main__":
    win = QuranApp()
    win.connect("destroy", Gtk.main_quit)
    win.show_all()
    Gtk.main()
