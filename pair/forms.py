from django import forms

class PlayerForm(forms.Form):
    players = forms.CharField(widget=forms.Textarea)