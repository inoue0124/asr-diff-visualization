#!/usr/bin/env python

# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Google Cloud Speech API sample application using the REST API for batch
processing.
Example usage:
    python transcribe.py resources/audio.raw
    python transcribe.py gs://cloud-samples-tests/speech/brooklyn.flac
"""

import argparse
import numpy

def transcribe_file(speech_file) -> str:
    """Transcribe the given audio file."""
    from google.cloud import speech
    import io

    client = speech.SpeechClient()

    with io.open(speech_file, "rb") as audio_file:
        content = audio_file.read()

    audio = speech.RecognitionAudio(content=content)
    config = speech.RecognitionConfig(
        language_code="en-US",
        enable_automatic_punctuation=True,
    )

    response = client.recognize(config=config, audio=audio)
    return ''.join([result.alternatives[0].transcript for result in response.results])


def editDistance(r, h):
    '''
    This function is to calculate the edit distance of reference sentence and the hypothesis sentence.
    Main algorithm used is dynamic programming.
    Attributes:
        r -> the list of words produced by splitting reference sentence.
        h -> the list of words produced by splitting hypothesis sentence.
    '''
    d = numpy.zeros((len(r)+1)*(len(h)+1), dtype=numpy.uint8).reshape((len(r)+1, len(h)+1))
    for i in range(len(r)+1):
        d[i][0] = i
    for j in range(len(h)+1):
        d[0][j] = j
    for i in range(1, len(r)+1):
        for j in range(1, len(h)+1):
            if r[i-1] == h[j-1]:
                d[i][j] = d[i-1][j-1]
            else:
                substitute = d[i-1][j-1] + 1
                insert = d[i][j-1] + 1
                delete = d[i-1][j] + 1
                d[i][j] = min(substitute, insert, delete)
    return d


def wer(reference: str, target: str) -> float:
    ref_wlist = reference.split()
    tgt_wlist = target.split()
    distance = editDistance(ref_wlist, tgt_wlist)

    result = float(distance[len(ref_wlist)][len(tgt_wlist)]) / len(ref_wlist) * 100
    return result


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter
    )
    parser.add_argument("path", help="File or GCS path for audio file to be recognized")
    args = parser.parse_args()

    reference1 = "Sophie wants to become a dentist. She is studying at a dental school in Chicago. The program is hard, and Sophie has to study a lot. However, she still finds time to do some volunteer work. Once every few weeks, she goes to different elementary schools to talk to the students. She teaches the students how to take care of their teeth."
    reference2 = "Welcome to our medical conference. We hope you are enjoying the speeches by leading doctors from around the world. We would like to let you know that Dr. Baker's speech has been delayed. It will start after the lunch break at 2 p.m. The speech will be about using robots in hospitals."
    reference3 = "I am in my fourth year at a nursing college in Japan. I am most interested in disaster medical care. It provides treatments not only for acute conditions but also for infectious diseases and chronic conditions. It serves under very stressful situations with limited resources. I would like to participate in D,MAT, Disaster Medical Assistance Team,in the future."

    transcript = transcribe_file(args.path)
    print('{0},"{1}","{2}",{3}'.format(args.path, reference3, transcript, wer(reference=reference3,target=transcript)))