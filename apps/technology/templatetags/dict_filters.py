from django import template

register = template.Library()

@register.filter
def get_item(dictionary, key):
    """
    Get an item from a dictionary using key.
    Usage: {{ my_dict|get_item:key_variable }}
    """
    try:
        return dictionary.get(key, '')
    except (KeyError, AttributeError, TypeError):
        return ''