import gi
import requests
import random

gi.require_version("Gtk", "3.0")
from gi.repository import Gtk, Pango, Gdk

# تعداد آیات هر سوره (نمونه)
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
    # ... ادامه همه سوره‌ها
}

EDITION = "quran-simple"

def get_random_ayah():
    sura = random.choice(list(sura_verses.keys()))
    ayah = random.randint(1, sura_verses[sura])
    url = f"http://api.alquran.cloud/v1/ayah/{sura}:{ayah}/{EDITION}"
    try:
        res = requests.get(url, timeout=5)
        data = res.json()
        text = data.get("data", {}).get("text", "آیه پیدا نشد")
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

        self.label = Gtk.Label(label="📖 آیه تصادفی قرآن")
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

        self.button = Gtk.Button(label="آیه بعدی 🔄")
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
