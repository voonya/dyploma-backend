import re
import json
import sys
import os
import pickle

import spacy

nlp = spacy.load("ru_core_news_lg")
import ru_core_news_lg
nlp = ru_core_news_lg.load()
lemmatizer = nlp.get_pipe("lemmatizer")

def extract_lemmas(text):
    doc = nlp(text)
    lemmas = [token.lemma_ for token in doc]
    return " ".join(lemmas)

ru_stopwords = ['а','е','и','ж','м','о','на','не','ни','об','но','он','мне','мои','мож','она','они','оно','мной','много','многочисленное','многочисленная','многочисленные','многочисленный','мною','мой','мог','могут','можно','может','можхо','мор','моя','моё','мочь','над','нее','оба','нам','нем','нами','ними','мимо','немного','одной','одного','менее','однажды','однако','меня','нему','меньше','ней','наверху','него','ниже','мало','надо','один','одиннадцать','одиннадцатый','назад','наиболее','недавно','миллионов','недалеко','между','низко','меля','нельзя','нибудь','непрерывно','наконец','никогда','никуда','нас','наш','нет','нею','неё','них','мира','наша','наше','наши','ничего','начала','нередко','несколько','обычно','опять','около','мы','ну','нх','от','отовсюду','особенно','нужно','очень','отсюда','в','во','вон','вниз','внизу','вокруг','вот','восемнадцать','восемнадцатый','восемь','восьмой','вверх','вам','вами','важное','важная','важные','важный','вдали','везде','ведь','вас','ваш','ваша','ваше','ваши','впрочем','весь','вдруг','вы','все','второй','всем','всеми','времени','время','всему','всего','всегда','всех','всею','всю','вся','всё','всюду','г','год','говорил','говорит','года','году','где','да','ее','за','из','ли','же','им','до','по','ими','под','иногда','довольно','именно','долго','позже','более','должно','пожалуйста','значит','иметь','больше','пока','ему','имя','пор','пора','потом','потому','после','почему','почти','посреди','ей','два','две','двенадцать','двенадцатый','двадцать','двадцатый','двух','его','дел','или','без','день','занят','занята','занято','заняты','действительно','давно','девятнадцать','девятнадцатый','девять','девятый','даже','алло','жизнь','далеко','близко','здесь','дальше','для','лет','зато','даром','первый','перед','затем','зачем','лишь','десять','десятый','ею','её','их','бы','еще','при','был','про','процентов','против','просто','бывает','бывь','если','люди','была','были','было','будем','будет','будете','будешь','прекрасно','буду','будь','будто','будут','ещё','пятнадцать','пятнадцатый','друго','другое','другой','другие','другая','других','есть','пять','быть','лучше','пятый','к','ком','конечно','кому','кого','когда','которой','которого','которая','которые','который','которых','кем','каждое','каждая','каждые','каждый','кажется','как','какой','какая','кто','кроме','куда','кругом','с','т','у','я','та','те','уж','со','то','том','снова','тому','совсем','того','тогда','тоже','собой','тобой','собою','тобою','сначала','только','уметь','тот','тою','хорошо','хотеть','хочешь','хоть','хотя','свое','свои','твой','своей','своего','своих','свою','твоя','твоё','раз','уже','сам','там','тем','чем','сама','сами','теми','само','рано','самом','самому','самой','самого','семнадцать','семнадцатый','самим','самими','самих','саму','семь','чему','раньше','сейчас','чего','сегодня','себе','тебе','сеаой','человек','разве','теперь','себя','тебя','седьмой','спасибо','слишком','так','такое','такой','такие','также','такая','сих','тех','чаще','четвертый','через','часто','шестой','шестнадцать','шестнадцатый','шесть','четыре','четырнадцать','четырнадцатый','сколько','сказал','сказала','сказать','ту','ты','три','эта','эти','что','это','чтоб','этом','этому','этой','этого','чтобы','этот','стал','туда','этим','этими','рядом','тринадцать','тринадцатый','этих','третий','тут','эту','суть','чуть','тысяч']

def remove_emojis(text):
    # Define regex pattern for emojis
    emoji_pattern = re.compile("["
                               u"\U0001F600-\U0001F64F"  # emoticons
                               u"\U0001F300-\U0001F5FF"  # symbols & pictographs
                               u"\U0001F680-\U0001F6FF"  # transport & map symbols
                               u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
                               u"\U00002500-\U00002BEF"  # chinese char
                               u"\U00002702-\U000027B0"
                               u"\U00002702-\U000027B0"
                               u"\U000024C2-\U0001F251"
                               u"\U0001f926-\U0001f937"
                               u"\U00010000-\U0010ffff"
                               u"\u2640-\u2642"
                               u"\u2600-\u2B55"
                               u"\u200d"
                               u"\u23cf"
                               u"\u23e9"
                               u"\u231a"
                               u"\ufe0f"  # dingbats
                               u"\u3030"
                               "]+", flags=re.UNICODE)
    # Remove emojis from the text
    return emoji_pattern.sub(r'', text)

def remove_link_mails_hashtags_tags(text):
    return ' '.join(re.sub("(\S+@\S+\.\S+)|(@[\_A-Za-z0-9]+)|(\w+:\/\/\S+)|", "", text).split())

def remove_card_numbers(text):
    return ' '.join(re.sub("(\d{16})", "", text).split())

def remove_phone_numbers(text):
    return ' '.join(re.sub("((\+\d{1,3})?\s?\(?\d{1,4}\)?[\s.-]?\d{3}[\s.-]?\d{4})", "", text).split())

def remove_punctuation(text):
    return ' '.join(re.sub("([^\w\s]+)", " ", text).split())

def remove_english_text(text):
    return ' '.join(re.sub("([A-Za-z]{2,})", " ", text).split())

def remove_cut_words(text):
    return ' '.join(re.sub("((\s|[\.]{0,})[а-яёА-яЁ]\.)", " ", text).split())

def remove_number_abbr(text):
    return ' '.join(re.sub("(\d+\-[а-яёА-яЁ]+)", " ", text).split())

def remove_numbers(text):
    return ' '.join(re.sub("([0-9]+)", " ", text).split())

def remove_single_characters(text):
    return ' '.join(re.sub("(^|\s+)([а-яёА-яЁa-zA-Z](\s+|$))+", " ", text).split())

def to_lower(text):
    return text.lower()

def remove_template_phrases(text):
    return ' '.join(re.sub("(подпишись|подписывайтесь|подписывайся|(наш\sчат)|(просим поддержать репостами)|подписаться|архангел спецназа|прислать нам).*", " ", text).split())

def clear_text(text):
    from functools import reduce
    pipeline = [remove_emojis, remove_link_mails_hashtags_tags, remove_card_numbers, remove_phone_numbers, remove_number_abbr, remove_punctuation, remove_numbers, remove_english_text, to_lower, remove_single_characters, remove_template_phrases, extract_lemmas]

    return reduce(lambda text, func: func(text), pipeline, text)

def load_models(folder, model_name):
    models = {}
    models_files = [file for file in os.listdir(folder) if file.endswith(".pkl")]
    folder_path_converters = folder + '/converters'

    vectorizer = None
    tfidfconverter = None 

    with open(f"{folder_path_converters}/vectorizer.pkl", 'rb') as file:
        vectorizer = pickle.load(file)
    
    with open(f"{folder_path_converters}/tfidfconverter.pkl", 'rb') as file:
        tfidfconverter = pickle.load(file)

    for model_file in models_files:
        current_model_name = model_file.split(".", 1)[0]
        if(current_model_name != model_name):
            continue
        with open(f"{folder}/{model_file}", 'rb') as file:
            models[model_name] = pickle.load(file)

    return models, vectorizer, tfidfconverter


def predict(msgs, classifier, vectorizer, tfidfconverter):
    text = vectorizer.transform(msgs).toarray()
    text = tfidfconverter.transform(text).toarray()
    labels = classifier.predict(text)
    return labels


def is_propaganda(texts):
    cleared_texts = (clear_text(text) for text in texts)
    # try:
    #     return os.getcwd()
    # except Exception as e:
    #     return str(e)
    #print("*******Text cleared*******")
    models, vectorizer, tfidfconverter = load_models('./src/infrastructure/data-analys/python-scripts/models/old_tg_data_15000_features', 'Naive Bayes')
    #print("*******Models loaded*******")
    result = predict(cleared_texts, models['Naive Bayes'], vectorizer, tfidfconverter)

    #print("*******Prediction done*******")
    return json.dumps({'is_propaganda': [bool(isp) for isp in result]})

data = json.loads(sys.argv[1])
print(is_propaganda(data))