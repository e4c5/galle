# Generated by Django 2.1 on 2018-08-23 05:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NameCorrection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.TextField()),
                ('correct_form', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Participant',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('old_rating', models.IntegerField(default=0, null=True)),
                ('new_rating', models.IntegerField(default=0, null=True)),
                ('games', models.IntegerField(default=0, null=True)),
                ('wins', models.FloatField(default=0, null=True)),
                ('spread', models.IntegerField(default=0, null=True)),
                ('position', models.IntegerField(default=0, null=True)),
                ('offed', models.IntegerField(default=0, null=True)),
                ('seed', models.IntegerField(default=0, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Player',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('full_name', models.TextField()),
                ('country', models.TextField(default='SL')),
                ('slug', models.TextField(unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Rating',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('old_rating', models.IntegerField(default=0, null=True)),
                ('new_rating', models.IntegerField(default=0, null=True)),
                ('games', models.IntegerField(default=0, null=True)),
                ('wins', models.FloatField(default=0, null=True)),
                ('expected', models.FloatField(default=0, null=True)),
                ('player', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pair.Player')),
            ],
        ),
        migrations.CreateModel(
            name='RoundResult',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wins', models.FloatField(default=0)),
                ('spread', models.IntegerField(default=0)),
                ('position', models.IntegerField(default=0, null=True)),
                ('score_for', models.IntegerField(blank=True, null=True)),
                ('score_against', models.IntegerField(blank=True, null=True)),
                ('first', models.IntegerField(default=0)),
            ],
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_date', models.TextField()),
                ('name', models.TextField()),
                ('rated', models.IntegerField(default=True)),
                ('slug', models.TextField(unique=True)),
                ('players', models.ManyToManyField(through='pair.Participant', to='pair.Player')),
            ],
        ),
        migrations.CreateModel(
            name='TournamentRound',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('round_no', models.IntegerField()),
                ('spread_cap', models.IntegerField(blank=True, null=True)),
                ('pairing_system', models.IntegerField(choices=[[1, 'Round Robin'], [2, 'Swiss'], [3, 'KOTH'], [4, 'Random']])),
                ('repeats', models.IntegerField(default=0)),
                ('based_on', models.IntegerField(blank=True, null=True)),
                ('tournament', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='pair.Tournament')),
            ],
        ),
        migrations.AddField(
            model_name='roundresult',
            name='game',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pair.TournamentRound'),
        ),
        migrations.AddField(
            model_name='roundresult',
            name='opponent',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player2', to='pair.Participant'),
        ),
        migrations.AddField(
            model_name='roundresult',
            name='participant',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='player1', to='pair.Participant'),
        ),
        migrations.AddField(
            model_name='roundresult',
            name='tournament',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pair.Tournament'),
        ),
        migrations.AddField(
            model_name='rating',
            name='tournament',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pair.Tournament'),
        ),
        migrations.AddField(
            model_name='participant',
            name='player',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pair.Player'),
        ),
        migrations.AddField(
            model_name='participant',
            name='tournament',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='pair.Tournament'),
        ),
        migrations.AddField(
            model_name='namecorrection',
            name='player',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='pair.Player'),
        ),
    ]
